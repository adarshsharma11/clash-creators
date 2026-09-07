"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatorAvatar } from "@/components/ui/creator-avatar";
import { ShareButton } from "@/components/ui/share-button";
import { SocialPlatformIcon } from "@/components/ui/social-platform-icon";
import { StatusBadge } from "@/components/ui/status-badge";
import { useJoinClash } from "@/hooks/mutations/use-join-clash";
import { useAvailableClashes } from "@/hooks/queries/use-clashes";
import { clashPageHref, findClashByRef, getReasonablyJoinableClashes, participantLabel } from "@/lib/join-clash-flow";
import { getJoinClashErrorMessage, isAlreadyJoinedError } from "@/lib/join-clash-errors";
import { normalizeJoinUsername } from "@/lib/join-clash";
import { SOCIAL_PLATFORMS, getSocialPlatformMeta } from "@/lib/social-platforms";
import { cn } from "@/lib/utils";
import { joinClashIdentitySchema, joinClashSchema } from "@/lib/validations/join-clash";
import type { ClashListItem } from "@/types/clash";
import type { SocialPlatform } from "@/types/creator";

export type JoinClashCardVariant = "hero" | "page" | "compact" | "modal";
type JoinStep = "details" | "username" | "platform" | "clash" | "confirm" | "success";

interface JoinClashCardProps {
  variant?: JoinClashCardVariant;
  clashId?: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
  className?: string;
}

export function JoinClashCard({
  variant = "page",
  clashId,
  title,
  description,
  onSuccess,
  className,
}: JoinClashCardProps) {
  const reduceMotion = useReducedMotion();
  const usernameId = useId();
  const platformId = useId();
  const clashOptions = useAvailableClashes();
  const joinMutation = useJoinClash();

  const [step, setStep] = useState<JoinStep>(variant === "modal" ? "username" : "details");
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform | "">("");
  const [pickedClashId, setPickedClashId] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const joinable = getReasonablyJoinableClashes(clashOptions.clashes);
  const lockedClash = findClashByRef(joinable, clashId) ?? findClashByRef(clashOptions.clashes, clashId);
  const selectedClash =
    findClashByRef(joinable, pickedClashId) ??
    lockedClash ??
    (joinable.length === 1 ? joinable[0] : null);

  const heading = title ?? (variant === "hero" ? "Join today's clash" : "Enter the next battle");
  const copy =
    description ??
    (variant === "hero"
      ? "Your creator. Today's clash."
      : "Represent your community. Pick your platform. Join the clash.");
  const isModal = variant === "modal";

  const compactClosed =
    variant === "compact" && lockedClash && !getReasonablyJoinableClashes([lockedClash]).length
      ? lockedClash.status === "LIVE"
        ? "Battle is live"
        : "Entries are closed"
      : null;

  const goToAfterDetails = () => {
    if (!selectedClash && joinable.length > 1) {
      setStep("clash");
      return;
    }
    setStep("confirm");
  };

  const handleDetailsContinue = () => {
    const parsed = joinClashIdentitySchema.safeParse({
      username,
      platform,
    });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Enter your creator username and platform.");
      return;
    }
    setUsername(parsed.data.username);
    setPlatform(parsed.data.platform);
    setFieldError(null);
    goToAfterDetails();
  };

  const handleClashContinue = () => {
    if (!selectedClash) {
      setFieldError("Select a clash to join.");
      return;
    }
    setFieldError(null);
    setStep("confirm");
  };

  const handleJoin = () => {
    if (joinMutation.isPending || !selectedClash || !platform) {
      return;
    }

    const parsed = joinClashSchema.safeParse({
      clashId: selectedClash.id,
      username,
      platform,
    });
    if (!parsed.success) {
      setJoinError(parsed.error.issues[0]?.message ?? "Something went wrong. Please try again.");
      return;
    }

    setJoinError(null);
    joinMutation.mutate(parsed.data, {
      onSuccess: (result) => {
        if (result.alreadyJoined) {
          setJoinError("You're already participating in this clash.");
          return;
        }
        setStep("success");
        onSuccess?.();
      },
      onError: (error) => {
        if (isAlreadyJoinedError(error)) {
          setJoinError("You're already participating in this clash.");
          return;
        }
        setJoinError(getJoinClashErrorMessage(error));
      },
    });
  };

  const cardClass = cn(
    "w-full text-left",
    !isModal &&
      "rounded-3xl border border-amber-500/20 bg-card/70 shadow-[0_0_0_1px_rgba(245,158,11,0.06)]",
    variant === "hero" && "mx-auto max-w-md p-5 sm:p-6",
    variant === "page" && "p-5 sm:p-8",
    variant === "compact" && "p-5",
    isModal && "p-0",
    className
  );

  const frameId = variant === "hero" ? "join-clash" : undefined;

  if (clashOptions.isPending && variant !== "hero") {
    return <JoinClashCardSkeleton id={frameId} className={className} />;
  }

  if (compactClosed) {
    return (
      <div id={frameId} className={cardClass}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Want to enter the battle?</p>
        <p className="mt-3 text-lg font-bold">{compactClosed}</p>
        <p className="mt-1 text-sm text-muted-foreground">This clash is no longer accepting new creators.</p>
      </div>
    );
  }

  if (step === "success" && selectedClash && platform) {
    const href = clashPageHref(selectedClash);
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        id={frameId}
        className={cardClass}
        role="status"
        aria-live="polite"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">You&apos;re in</p>
        <h3 className="mt-3 text-2xl font-extrabold tracking-tight">🎉 You&apos;re in!</h3>
        <div className="mt-5 flex items-center gap-3">
          <CreatorAvatar username={username} name={username} className="h-12 w-12" />
          <div className="min-w-0">
            <p className="truncate font-bold">@{username} has joined</p>
            <p className="truncate text-sm text-muted-foreground">{selectedClash.title}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Platform: {getSocialPlatformMeta(platform).label}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">You&apos;re on the clash roster. Open the clash to see your name.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-11 flex-1 font-bold">
            <Link href={href}>View Clash</Link>
          </Button>
          <ShareButton
            url={href}
            title={selectedClash.title}
            text={`I just joined ${selectedClash.title} as @${username} on ClashCreators.`}
            className="h-11 flex-1 font-bold"
            label="Share"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div id={frameId} className={cardClass}>
      {isModal ? (
        <ModalStepIndicator current={step} />
      ) : (
        <>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{heading}</p>
          <h3 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
            {variant === "hero" ? "Are you ready to compete?" : copy}
          </h3>
          {variant === "hero" ? <p className="mt-1 text-sm text-muted-foreground">{copy}</p> : null}
        </>
      )}

      {clashOptions.isError ? (
        <div className="mt-5" role="alert">
          <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
          <Button type="button" variant="outline" className="mt-3 h-11 font-bold" onClick={() => void clashOptions.refetch()}>
            {clashOptions.isFetching ? "Retrying…" : "Retry"}
          </Button>
        </div>
      ) : clashOptions.isPending ? (
        <JoinClashCardSkeleton className="mt-5 border-0 bg-transparent p-0 shadow-none" />
      ) : joinable.length === 0 && step !== "success" ? (
        <div className="mt-5">
          <p className="font-semibold">No clash is open right now.</p>
          <p className="mt-1 text-sm text-muted-foreground">Check back soon for the next creator battle.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
            className="mt-5"
          >
            {step === "username" ? (
              <UsernameStep
                username={username}
                usernameId={usernameId}
                error={fieldError}
                onUsernameChange={(value) => {
                  setUsername(value);
                  setFieldError(null);
                }}
                onContinue={() => {
                  const parsed = joinClashIdentitySchema.pick({ username: true }).safeParse({ username });
                  if (!parsed.success) {
                    setFieldError(parsed.error.issues[0]?.message ?? "Enter your creator username.");
                    return;
                  }
                  setUsername(parsed.data.username);
                  setFieldError(null);
                  setStep("platform");
                }}
              />
            ) : null}

            {step === "platform" ? (
              <PlatformStep
                platform={platform}
                error={fieldError}
                onPlatformChange={(value) => {
                  setPlatform(value);
                  setFieldError(null);
                }}
                onContinue={() => {
                  if (!platform) {
                    setFieldError("Choose your main platform.");
                    return;
                  }
                  setFieldError(null);
                  goToAfterDetails();
                }}
                onBack={() => setStep("username")}
              />
            ) : null}

            {step === "details" ? (
              <DetailsStep
                variant={variant}
                username={username}
                platform={platform}
                usernameId={usernameId}
                platformId={platformId}
                error={fieldError}
                selectedClash={selectedClash}
                onUsernameChange={(value) => {
                  setUsername(value);
                  setFieldError(null);
                }}
                onPlatformChange={(value) => {
                  setPlatform(value);
                  setFieldError(null);
                }}
                onContinue={handleDetailsContinue}
              />
            ) : null}

            {step === "clash" ? (
              <ClashStep
                clashes={joinable}
                selectedId={selectedClash?.id ?? null}
                error={fieldError}
                onSelect={(id) => {
                  setPickedClashId(id);
                  setFieldError(null);
                }}
                onContinue={handleClashContinue}
                onBack={() => setStep(isModal ? "platform" : "details")}
              />
            ) : null}

            {step === "confirm" && selectedClash && platform ? (
              <ConfirmStep
                clash={selectedClash}
                username={normalizeJoinUsername(username)}
                platform={platform}
                submitting={joinMutation.isPending}
                error={joinError}
                onJoin={handleJoin}
                onEdit={() => {
                  setJoinError(null);
                  setStep(isModal ? "username" : "details");
                }}
                onRetry={handleJoin}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function ModalStepIndicator({ current }: { current: JoinStep }) {
  const active =
    current === "username" ? 0 : current === "platform" ? 1 : 2;
  const items = ["Creator", "Platform", "Join"];

  return (
    <ol className="mb-5 flex flex-wrap items-center gap-1 text-xs font-semibold" aria-label="Join progress">
      {items.map((label, index) => (
        <li key={label} className="flex items-center gap-1">
          <span className={index === active ? "text-primary" : "text-muted-foreground"} aria-current={index === active ? "step" : undefined}>
            {String(index + 1).padStart(2, "0")} {label}
          </span>
          {index < items.length - 1 ? <span className="text-muted-foreground">→</span> : null}
        </li>
      ))}
    </ol>
  );
}

function UsernameStep({
  username,
  usernameId,
  error,
  onUsernameChange,
  onContinue,
}: {
  username: string;
  usernameId: string;
  error: string | null;
  onUsernameChange: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onContinue();
      }}
    >
      <div>
        <label htmlFor={usernameId} className="mb-1.5 block text-sm font-semibold">
          What&apos;s your creator username?
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
          <input
            id={usernameId}
            name="username"
            autoComplete="username"
            placeholder="learn_with_sam"
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
            aria-describedby={`${usernameId}-hint${error ? ` ${usernameId}-error` : ""}`}
            aria-invalid={Boolean(error)}
            className="h-12 w-full rounded-xl border border-border/50 bg-background/70 pl-9 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <p id={`${usernameId}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          Use the username your audience knows you by.
        </p>
      </div>
      {error ? (
        <p id={`${usernameId}-error`} role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-12 w-full font-bold">
        Continue
      </Button>
    </form>
  );
}

function PlatformStep({
  platform,
  error,
  onPlatformChange,
  onContinue,
  onBack,
}: {
  platform: SocialPlatform | "";
  error: string | null;
  onPlatformChange: (value: SocialPlatform) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Choose your main platform</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SOCIAL_PLATFORMS.map((item) => {
            const selected = platform === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                onClick={() => onPlatformChange(item)}
                className={cn(
                  "flex h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border/50 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                <SocialPlatformIcon platform={item} className="h-4 w-4" />
                <span>{getSocialPlatformMeta(item).label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Button type="button" variant="outline" className="h-12 flex-1" onClick={onBack}>
          Back
        </Button>
        <Button type="button" className="h-12 flex-1 font-bold" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function DetailsStep({
  variant,
  username,
  platform,
  usernameId,
  platformId,
  error,
  selectedClash,
  onUsernameChange,
  onPlatformChange,
  onContinue,
}: {
  variant: JoinClashCardVariant;
  username: string;
  platform: SocialPlatform | "";
  usernameId: string;
  platformId: string;
  error: string | null;
  selectedClash: ClashListItem | null;
  onUsernameChange: (value: string) => void;
  onPlatformChange: (value: SocialPlatform) => void;
  onContinue: () => void;
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onContinue();
      }}
    >
      <div>
        <label htmlFor={usernameId} className="mb-1.5 block text-sm font-semibold">
          What&apos;s your creator username?
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
          <input
            id={usernameId}
            name="username"
            autoComplete="username"
            placeholder="learn_with_sam"
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
            aria-describedby={`${usernameId}-hint${error ? ` ${usernameId}-error` : ""}`}
            aria-invalid={Boolean(error)}
            className="h-12 w-full rounded-xl border border-border/50 bg-background/70 pl-9 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <p id={`${usernameId}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          Use the username your audience knows you by.
        </p>
      </div>

      {variant === "hero" ? (
        <div>
          <label htmlFor={platformId} className="mb-1.5 block text-sm font-semibold">
            Main platform
          </label>
          <select
            id={platformId}
            value={platform}
            onChange={(event) => onPlatformChange(event.target.value as SocialPlatform)}
            className="h-12 w-full rounded-xl border border-border/50 bg-background/70 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Choose a platform</option>
            {SOCIAL_PLATFORMS.map((item) => (
              <option key={item} value={item}>
                {getSocialPlatformMeta(item).label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Choose your main platform</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SOCIAL_PLATFORMS.map((item) => {
              const selected = platform === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onPlatformChange(item)}
                  className={cn(
                    "flex h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border/50 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <SocialPlatformIcon platform={item} className="h-4 w-4" />
                  <span>{getSocialPlatformMeta(item).label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {selectedClash && variant === "hero" ? (
        <p className="text-xs text-muted-foreground">
          Today&apos;s clash: <span className="font-semibold text-foreground">{selectedClash.title}</span>
        </p>
      ) : null}

      {error ? (
        <p id={`${usernameId}-error`} role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="h-12 w-full font-bold">
        {variant === "hero" ? "Join Today's Clash" : "Continue"}
      </Button>
    </form>
  );
}

function ClashStep({
  clashes,
  selectedId,
  error,
  onSelect,
  onContinue,
  onBack,
}: {
  clashes: ClashListItem[];
  selectedId: string | null;
  error: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold">Today&apos;s Clash</p>
      <div className="space-y-3">
        {clashes.map((clash) => {
          const selected = selectedId === clash.id;
          return (
            <button
              key={clash.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(clash.id)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected ? "border-primary bg-primary/10" : "border-border/50 bg-background/40"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold">{clash.title}</span>
                <StatusBadge status={clash.status} />
              </div>
              {clash.category ? <p className="mt-1 text-sm text-primary">{clash.category.name}</p> : null}
              <p className="mt-1 text-sm text-muted-foreground">
                {participantLabel(clash.participantCount, clash.maxParticipants)}
              </p>
            </button>
          );
        })}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Button type="button" variant="outline" className="h-12 flex-1" onClick={onBack}>
          Edit
        </Button>
        <Button type="button" className="h-12 flex-1 font-bold" onClick={onContinue}>
          Join this Clash
        </Button>
      </div>
    </div>
  );
}

function ConfirmStep({
  clash,
  username,
  platform,
  submitting,
  error,
  onJoin,
  onEdit,
  onRetry,
}: {
  clash: ClashListItem;
  username: string;
  platform: SocialPlatform;
  submitting: boolean;
  error: string | null;
  onJoin: () => void;
  onEdit: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold">You&apos;re joining</p>
      <div className="rounded-2xl border border-border/50 bg-background/40 p-4">
        <div className="flex items-center gap-3">
          <CreatorAvatar username={username} name={username} className="h-11 w-11" />
          <div className="min-w-0">
            <p className="font-bold">{clash.title}</p>
            <p className="text-sm text-muted-foreground">@{username}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Platform: {getSocialPlatformMeta(platform).label}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {participantLabel(clash.participantCount, clash.maxParticipants)}
        </p>
      </div>
      {error ? (
        <div role="alert">
          <p className="text-sm text-red-400">{error}</p>
          <Button type="button" variant="outline" className="mt-3 h-11 font-bold" disabled={submitting} onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Button type="button" variant="outline" className="h-12 flex-1" disabled={submitting} onClick={onEdit}>
          Edit
        </Button>
        <Button
          type="button"
          className="h-12 flex-1 font-bold"
          disabled={submitting}
          aria-busy={submitting}
          onClick={onJoin}
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {submitting ? "Joining..." : "Join Clash"}
        </Button>
      </div>
    </div>
  );
}

function JoinClashCardSkeleton({ className, id }: { className?: string; id?: string }) {
  return (
    <div
      id={id}
      className={cn("w-full rounded-3xl border border-border/50 bg-card/40 p-5 sm:p-6", className)}
      aria-busy="true"
      aria-label="Loading join clash"
    >
      <div className="skeleton-surface mb-3 h-3 w-28 rounded-full" />
      <div className="skeleton-surface mb-5 h-7 w-56 rounded-md" />
      <div className="skeleton-surface mb-3 h-12 w-full rounded-xl" />
      <div className="skeleton-surface h-12 w-full rounded-xl" />
    </div>
  );
}
