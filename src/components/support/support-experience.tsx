"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import type { Battle, BattleEntry } from "@/types/battle";
import type { Creator } from "@/types/creator";
import type { PaymentPhase, SupportIntent, SupportRankPreview } from "@/types/support";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { invalidateConfirmedSupportQueries } from "@/lib/query-invalidation";
import { useConfirmDemoSupport } from "@/hooks/mutations/use-confirm-demo-support";
import { useCreateSupport } from "@/hooks/mutations/use-create-support";
import { useVerifyRazorpayPayment } from "@/hooks/mutations/use-verify-razorpay-payment";
import { fetchClashLeaderboard } from "@/hooks/queries/use-clashes";
import { leaderboardToEntries } from "@/lib/clash-view";
import { openRazorpayCheckout, readRazorpayCheckout, RazorpayCheckoutError } from "@/lib/payments/razorpay";
import { calculateRankAfterSupport } from "@/lib/ranking";
import {
  DEFAULT_SUPPORT_AMOUNT,
  sanitizeSupportInput,
  validateSupportAmount,
} from "@/lib/support-amount";
import { getSupportPaymentErrorMessage } from "@/lib/support-errors";
import { createSupportIntent, requestSupportConfirmation } from "@/lib/support-intent";
import { ApiError } from "@/types/api";
import { RankPreview } from "./rank-preview";
import { SupportAmountSelector } from "./support-amount-selector";
import { SupportBattleStatus } from "./support-battle-status";
import { SupportConfirmation } from "./support-confirmation";
import { SupportCreatorCard } from "./support-creator-card";
import { SupportCustomAmount } from "./support-custom-amount";
import { SupportHero } from "./support-hero";
import { SupportSuccess } from "./support-success";
import { SupportSummary } from "./support-summary";
import { SupportTrust } from "./support-trust";
import { useToast } from "@/components/ui/toast";

type SupportStep = "select" | "confirm" | "success";
type AmountSource = "preset" | "custom";

interface SupportExperienceProps {
  creator: Creator;
  battle: Battle | null;
  entry: BattleEntry | null;
}

export function SupportExperience({ creator, battle, entry }: SupportExperienceProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { notify } = useToast();
  const reduceMotion = useReducedMotion();
  const createSupportMutation = useCreateSupport();
  const verifyPaymentMutation = useVerifyRazorpayPayment();
  const confirmDemoMutation = useConfirmDemoSupport();
  const inFlight = useRef(false);
  const [step, setStep] = useState<SupportStep>("select");
  const [amountSource, setAmountSource] = useState<AmountSource>("preset");
  const [presetAmount, setPresetAmount] = useState<number>(DEFAULT_SUPPORT_AMOUNT);
  const [customValue, setCustomValue] = useState("");
  const [intent, setIntent] = useState<SupportIntent | null>(null);
  const [resultPreview, setResultPreview] = useState<SupportRankPreview | null>(null);
  const [phase, setPhase] = useState<PaymentPhase>("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const customValidation = validateSupportAmount(customValue);
  const selectedAmount =
    amountSource === "custom" ? customValidation.amount : presetAmount;
  const customError = amountSource === "custom" ? customValidation.error : null;
  const currentEntry = battle?.entries.find((item) => item.creator.id === creator.id) ?? entry;
  const preview = useMemo(
    () =>
      selectedAmount && battle
        ? calculateRankAfterSupport(battle.entries, creator.id, selectedAmount)
        : currentEntry
          ? calculateRankAfterSupport(battle?.entries ?? [currentEntry], creator.id, 0)
          : null,
    [battle, creator.id, selectedAmount, currentEntry]
  );
  const clashHref = battle ? `/clash/${battle.slug ?? battle.id}` : undefined;
  const busy =
    createSupportMutation.isPending ||
    verifyPaymentMutation.isPending ||
    confirmDemoMutation.isPending;
  const canSubmit = selectedAmount !== null && step === "select" && Boolean(battle) && !busy && isAuthenticated;
  const loginPath = `/login?next=${encodeURIComponent(`/support/${creator.username}`)}`;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(loginPath);
    }
  }, [authLoading, isAuthenticated, loginPath, router]);

  const handlePresetSelect = (amount: number) => {
    setAmountSource("preset");
    setPresetAmount(amount);
    setCustomValue("");
  };

  const handleCustomChange = (value: string) => {
    setAmountSource("custom");
    setCustomValue(sanitizeSupportInput(value));
  };

  const handleOpenConfirm = () => {
    if (!selectedAmount || !battle) {
      return;
    }

    const nextIntent = requestSupportConfirmation(
      createSupportIntent({
        creatorId: creator.id,
        username: creator.username,
        amount: selectedAmount,
      })
    );

    setIntent(nextIntent);
    setPhase("idle");
    setPaymentError(null);
    createSupportMutation.reset();
    verifyPaymentMutation.reset();
    confirmDemoMutation.reset();
    setStep("confirm");
  };

  const applyConfirmedSupport = async (clashId: string, clashSlug?: string) => {
    await invalidateConfirmedSupportQueries(queryClient, {
      username: creator.username,
      clashId,
      clashSlug,
    });

    try {
      const leaderboard = await fetchClashLeaderboard(queryClient, clashId);
      setResultPreview(
        calculateRankAfterSupport(leaderboardToEntries(leaderboard.items), creator.id, 0)
      );
    } catch {
      setResultPreview(null);
    }

    setPhase("confirmed");
    setStep("success");
    notify({
      tone: "success",
      title: "Support confirmed",
      message: `You supported @${creator.username}.`,
    });
  };

  const handleConfirm = async () => {
    if (!intent || !battle || inFlight.current || busy) {
      return;
    }

    if (phase !== "idle" && phase !== "failed" && phase !== "cancelled") {
      return;
    }

    if (!isAuthenticated) {
      router.push(loginPath);
      return;
    }

    inFlight.current = true;
    setPaymentError(null);
    setPhase("creating_order");

    try {
      const result = await createSupportMutation.mutateAsync({
        clashId: battle.id,
        creatorId: creator.id,
        points: intent.amount,
      });

      const supportId = result.support?.id ?? result.supportId;
      const checkout =
        readRazorpayCheckout(result.payment.checkout) ??
        readRazorpayCheckout({
          keyId: result.keyId,
          orderId: result.orderId,
          amount: result.amount,
          currency: result.currency,
        });

      if (!checkout?.keyId) {
        if (!supportId) {
          throw new RazorpayCheckoutError(
            "The payment order is not ready. The backend did not return a Razorpay order.",
            "missing_order"
          );
        }

        setPhase("verifying");
        const demoSupport = await confirmDemoMutation.mutateAsync(supportId);
        if (demoSupport.status !== "CONFIRMED") {
          setPhase("failed");
          setPaymentError("Test support could not be confirmed. No points were added.");
          return;
        }

        await applyConfirmedSupport(battle.id, battle.slug);
        return;
      }

      if (!checkout.orderId) {
        throw new RazorpayCheckoutError(
          "The payment order is not ready. The backend did not return a Razorpay order.",
          "missing_order"
        );
      }

      setPhase("checkout_open");
      const checkoutResult = await openRazorpayCheckout({
        checkout,
        name: "ClashCreators",
        description: `Support @${creator.username}`,
        prefill: {
          name: user?.fullName,
          email: user?.email,
        },
      });

      setPhase("verifying");
      const verification = await verifyPaymentMutation.mutateAsync({
        razorpay_order_id: checkoutResult.razorpay_order_id,
        razorpay_payment_id: checkoutResult.razorpay_payment_id,
        razorpay_signature: checkoutResult.razorpay_signature,
      });

      if (verification.status !== "CONFIRMED") {
        setPhase("failed");
        setPaymentError("Payment could not be verified. No points were added.");
        return;
      }

      await applyConfirmedSupport(battle.id, battle.slug);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push(loginPath);
        setPhase("idle");
        return;
      }

      if (error instanceof RazorpayCheckoutError && error.reason === "cancelled") {
        setPhase("cancelled");
        setPaymentError(getSupportPaymentErrorMessage(error));
        return;
      }

      setPhase("failed");
      setPaymentError(getSupportPaymentErrorMessage(error));
    } finally {
      inFlight.current = false;
    }
  };

  const handleBack = () => {
    if (phase === "creating_order" || phase === "checkout_open" || phase === "verifying") {
      return;
    }

    createSupportMutation.reset();
    verifyPaymentMutation.reset();
    confirmDemoMutation.reset();
    setPhase("idle");
    setPaymentError(null);
    setStep("select");
  };

  if (step === "success" && intent) {
    return (
      <div className="container mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-8">
        <SupportSuccess
          creator={creator}
          amount={intent.amount}
          preview={resultPreview}
          clashHref={clashHref}
          clashTitle={battle?.title}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-8 md:pb-16">
      <Link
        href={`/creators/${creator.username}`}
        className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to @{creator.username}
      </Link>

      <SupportHero creator={creator} />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <div className="space-y-6">
          <SupportCreatorCard
            creator={creator}
            entry={currentEntry}
            distanceToFirst={preview?.currentDistanceToFirst ?? 0}
          />
          <SupportBattleStatus battle={battle} entry={currentEntry} />
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="space-y-8"
        >
          <SupportAmountSelector
            selectedAmount={amountSource === "preset" ? presetAmount : null}
            onSelect={handlePresetSelect}
          />

          <SupportCustomAmount
            value={customValue}
            error={customError}
            active={amountSource === "custom"}
            onChange={handleCustomChange}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAmount ?? "empty"}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <SupportSummary
                creator={creator}
                amount={selectedAmount}
                preview={selectedAmount ? preview : null}
              />
              <RankPreview
                creator={creator}
                amount={selectedAmount}
                preview={selectedAmount ? preview : null}
              />
            </motion.div>
          </AnimatePresence>

          <Button
            size="lg"
            className="hidden h-14 w-full text-base font-bold md:inline-flex"
            disabled={!canSubmit}
            onClick={handleOpenConfirm}
          >
            {selectedAmount
              ? `Support @${creator.username} +${selectedAmount}`
              : `Support @${creator.username}`}
          </Button>

          <SupportTrust />

          <nav aria-label="Related pages" className="flex flex-wrap gap-4 text-sm">
            <Link
              href={`/creators/${creator.username}`}
              className="font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              View @{creator.username}
            </Link>
            {clashHref ? (
              <Link
                href={clashHref}
                className="font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                View Clash
              </Link>
            ) : null}
          </nav>
        </motion.div>
      </div>

      {step === "select" ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
          <Button
            size="lg"
            className="h-14 w-full text-base font-bold"
            disabled={!canSubmit}
            onClick={handleOpenConfirm}
          >
            {selectedAmount
              ? `Support @${creator.username} +${selectedAmount}`
              : `Support @${creator.username}`}
          </Button>
        </div>
      ) : null}

      <SupportConfirmation
        open={step === "confirm"}
        username={creator.username}
        amount={intent?.amount ?? selectedAmount ?? 0}
        phase={phase}
        error={paymentError}
        confirmLabel={isAuthenticated ? "Continue to payment" : "Sign in to support"}
        clashTitle={battle?.title}
        displayName={creator.displayName}
        onConfirm={() => {
          void handleConfirm();
        }}
        onBack={handleBack}
      />
    </div>
  );
}
