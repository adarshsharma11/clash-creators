"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ApiRetryButton, ApiStatusPanel } from "@/components/ui/api-status-panel";
import { useAuth } from "@/context/auth-context";
import { useJoinClash } from "@/hooks/mutations/use-join-clash";
import { getClash } from "@/lib/api/clashes";
import { useCategories } from "@/hooks/queries/use-categories";
import { useClashes } from "@/hooks/queries/use-clashes";
import { useCreator } from "@/hooks/queries/use-creators";
import { getJoinClashErrorMessage } from "@/lib/join-clash-errors";
import { hasJoinClashErrors, validateJoinClashStep } from "@/lib/join-clash";
import type { ClashListItem } from "@/types/clash";
import {
  EMPTY_JOIN_CLASH_DRAFT,
  type JoinClashDraft,
  type JoinClashFieldErrors,
  type JoinClashStep,
} from "@/types/join-clash";
import { ApiError, getApiErrorMessage } from "@/types/api";
import { CategoryStep } from "./category-step";
import { ClashPreviewStep } from "./clash-preview-step";
import { CreatorInfoStep } from "./creator-info-step";
import { JoinClashProgress } from "./join-clash-progress";
import { JoinClashSuccess } from "./join-clash-success";
import { ReviewStep } from "./review-step";

function findJoinableClash(clashes: ClashListItem[], categoryId: string | null): ClashListItem | null {
  if (!categoryId) {
    return null;
  }

  return (
    clashes.find((clash) => clash.category?.id === categoryId || clash.category?.slug === categoryId) ??
    null
  );
}

function joinStatusMessage(status: ClashListItem["status"]): string {
  if (status === "DRAFT") {
    return "This clash is still a draft and cannot be joined.";
  }
  if (status === "LIVE") {
    return "This clash is already live and no longer accepting joins.";
  }
  if (status === "COMPLETED") {
    return "This clash has already ended.";
  }
  if (status === "CANCELLED") {
    return "This clash was cancelled.";
  }
  return "This clash cannot be joined right now.";
}

export function JoinClashForm() {
  "use no memo";
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { user, isAuthenticated, isInitializing } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);
  const [step, setStep] = useState<JoinClashStep>(1);
  const [direction, setDirection] = useState(1);
  const [draft, setDraft] = useState<JoinClashDraft>(EMPTY_JOIN_CLASH_DRAFT);
  const [errors, setErrors] = useState<JoinClashFieldErrors>({});
  const [joinedClash, setJoinedClash] = useState<ClashListItem | null>(null);
  const [checkingClash, setCheckingClash] = useState(false);

  const username = user?.username ?? "";
  const creatorQuery = useCreator(username, isAuthenticated);
  const categoriesQuery = useCategories();
  const upcomingQuery = useClashes({ status: "UPCOMING", page: 1, limit: 50 });
  const joinMutation = useJoinClash(username);
  const { notify } = useToast();

  const categories = categoriesQuery.data ?? [];
  const upcomingClashes = upcomingQuery.data?.items ?? [];
  const selectedClash = findJoinableClash(upcomingClashes, draft.categoryId);
  const category =
    categories.find((item) => item.id === draft.categoryId || item.slug === draft.categoryId) ?? null;
  const submitting = joinMutation.isPending || checkingClash;
  const continueLabel = submitting ? "Joining…" : step === 4 ? "Join Clash" : "Continue";
  const stepEnter = reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 16 };
  const stepExit = reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -16 };

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent("/join-clash")}`);
    }
  }, [isAuthenticated, isInitializing, router]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    panelRef.current?.focus();
  }, [step, joinedClash]);

  const creatorProfile = creatorQuery.data;

  const filledDraft = useMemo<JoinClashDraft>(() => {
    if (!creatorProfile) {
      return draft;
    }

    return {
      ...draft,
      displayName: creatorProfile.displayName,
      username: creatorProfile.user.username,
      bio: creatorProfile.bio ?? "",
      avatarPreviewUrl: creatorProfile.avatarUrl ?? creatorProfile.user.avatarUrl,
    };
  }, [creatorProfile, draft]);

  const updateDraft = (patch: Partial<JoinClashDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch) as (keyof JoinClashDraft)[]) {
        if (key in next) {
          delete next[key as keyof JoinClashFieldErrors];
        }
      }
      return next;
    });
  };

  const goTo = (nextStep: JoinClashStep) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
    setErrors({});
    joinMutation.reset();
  };

  const handleContinue = () => {
    if (submitting) {
      return;
    }

    const nextErrors =
      step === 1
        ? {}
        : validateJoinClashStep(step, filledDraft, categories.map((item) => item.id));

    if (step === 2 && !nextErrors.categoryId && !selectedClash) {
      nextErrors.categoryId = "No upcoming clash is open in this category yet.";
    }

    setErrors(nextErrors);

    if (hasJoinClashErrors(nextErrors)) {
      return;
    }

    if (step === 4) {
      if (!isAuthenticated) {
        router.replace(`/login?next=${encodeURIComponent("/join-clash")}`);
        return;
      }

      if (!selectedClash) {
        setErrors({ categoryId: "Select a joinable clash." });
        return;
      }

      setCheckingClash(true);
      void getClash(selectedClash.id)
        .then((clash) => {
          if (clash.status !== "UPCOMING") {
            setErrors({ categoryId: joinStatusMessage(clash.status) });
            return;
          }

          joinMutation.mutate(
            { clashId: clash.id },
            {
              onSuccess: (result) => {
                setJoinedClash({
                  ...selectedClash,
                  id: result.clash.id,
                  slug: result.clash.slug,
                  title: result.clash.title,
                  status: result.clash.status,
                });
                notify({
                  tone: "success",
                  title: "You're in!",
                  message: `You joined ${result.clash.title}.`,
                });
              },
            }
          );
        })
        .catch((error) => {
          setErrors({ categoryId: getJoinClashErrorMessage(error) });
        })
        .finally(() => {
          setCheckingClash(false);
        });
      return;
    }

    goTo((step + 1) as JoinClashStep);
  };

  const handleBack = () => {
    if (step === 1 || submitting) {
      return;
    }

    goTo((step - 1) as JoinClashStep);
  };

  if (isInitializing) {
    return (
      <div className="rounded-3xl border border-border/50 bg-card/30 px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ApiStatusPanel
        title="Sign in to join a clash"
        message="Join Clash is available to signed-in creators."
        action={
          <Button asChild className="font-bold">
            <Link href={`/login?next=${encodeURIComponent("/join-clash")}`}>Sign in</Link>
          </Button>
        }
      />
    );
  }

  if (creatorQuery.isPending || categoriesQuery.isPending || upcomingQuery.isPending) {
    return (
      <div className="rounded-3xl border border-border/50 bg-card/30 px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">Loading your clash entry…</p>
      </div>
    );
  }

  if (creatorQuery.isError) {
    if (creatorQuery.error instanceof ApiError && creatorQuery.error.status === 404) {
      return (
        <ApiStatusPanel
          title="Creator profile required"
          message="A creator profile is required to join a clash."
          action={
            <Button asChild variant="outline" className="font-bold">
              <Link href="/">Back home</Link>
            </Button>
          }
        />
      );
    }

    return (
      <ApiStatusPanel
        title="Unable to load your creator profile"
        message={getApiErrorMessage(creatorQuery.error)}
        action={
          <ApiRetryButton
            onRetry={() => void creatorQuery.refetch()}
            isRetrying={creatorQuery.isFetching}
          />
        }
      />
    );
  }

  if (categoriesQuery.isError || upcomingQuery.isError) {
    return (
      <ApiStatusPanel
        title="Unable to load joinable clashes"
        message={getApiErrorMessage(categoriesQuery.error ?? upcomingQuery.error)}
        action={
          <ApiRetryButton
            onRetry={() => {
              if (categoriesQuery.isError) void categoriesQuery.refetch();
              if (upcomingQuery.isError) void upcomingQuery.refetch();
            }}
            isRetrying={categoriesQuery.isFetching || upcomingQuery.isFetching}
          />
        }
      />
    );
  }

  if (joinedClash) {
    return (
      <div ref={panelRef} tabIndex={-1} className="outline-none">
        <JoinClashSuccess
          clashHref={`/clash/${joinedClash.slug}`}
          creatorHref={`/creators/${username}`}
          clashTitle={joinedClash.title}
        />
      </div>
    );
  }

  return (
    <div id="join-clash-form" className="rounded-3xl border border-border/50 bg-card/30 p-5 sm:p-8">
      <JoinClashProgress step={step} />

      <div ref={panelRef} tabIndex={-1} className="outline-none">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={stepEnter}
            animate={{ opacity: 1, x: 0 }}
            exit={stepExit}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {step === 1 ? (
              <CreatorInfoStep
                draft={filledDraft}
                errors={errors}
                locked
                onChange={updateDraft}
                onAvatarChange={() => undefined}
              />
            ) : null}
            {step === 2 ? (
              <CategoryStep
                draft={filledDraft}
                errors={errors}
                categories={categories}
                onSelect={(categoryId) => updateDraft({ categoryId })}
              />
            ) : null}
            {step === 3 ? (
              <ClashPreviewStep draft={filledDraft} category={category} clash={selectedClash} />
            ) : null}
            {step === 4 ? (
              <ReviewStep draft={filledDraft} category={category} clash={selectedClash} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {joinMutation.isError ? (
        <p role="alert" className="mt-6 text-sm text-red-400">
          {getJoinClashErrorMessage(joinMutation.error)}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-full sm:w-auto"
          disabled={step === 1 || submitting}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          size="lg"
          className="h-12 w-full font-bold sm:w-auto"
          disabled={submitting}
          aria-busy={submitting}
          onClick={handleContinue}
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {continueLabel}
        </Button>
      </div>
    </div>
  );
}
