"use client";

import { motion, useReducedMotion } from "motion/react";
import { Avatar } from "@/components/ui/avatar";
import type { ClashListItem } from "@/types/clash";
import type { Category } from "@/types/category";
import type { JoinClashDraft } from "@/types/join-clash";
import { normalizeJoinUsername } from "@/lib/join-clash";

interface ClashPreviewStepProps {
  draft: JoinClashDraft;
  category: Category | null;
  clash: ClashListItem | null;
}

export function ClashPreviewStep({ draft, category, clash }: ClashPreviewStepProps) {
  const reduceMotion = useReducedMotion();
  const username = normalizeJoinUsername(draft.username) || "yourname";
  const displayName = draft.displayName.trim() || "Your name";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Clash preview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is how you will appear on the selected clash board.
        </p>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl border border-border/50 bg-card/40 p-6"
      >
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">
          {clash?.title ?? "Clash preview"}
        </p>

        <div className="mb-6 flex items-center gap-4">
          <Avatar
            src={draft.avatarPreviewUrl ?? undefined}
            alt=""
            fallback={displayName}
            className="h-16 w-16 ring-2 ring-primary/20"
          />
          <div className="min-w-0">
            <p className="truncate text-sm text-muted-foreground">@{username}</p>
            <p className="truncate text-xl font-bold">{displayName}</p>
            <p className="text-sm text-primary">{category?.name ?? "Category"}</p>
          </div>
        </div>

        <div className="mb-6 inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          {clash ? "Upcoming clash" : "No joinable clash"}
        </div>

        <div className="rounded-2xl border border-border/40 bg-background/50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            How you would appear
          </p>
          <div className="flex items-center gap-3">
            <span className="w-8 font-mono text-lg font-black text-muted-foreground">—</span>
            <Avatar
              src={draft.avatarPreviewUrl ?? undefined}
              alt=""
              fallback={displayName}
              className="h-10 w-10"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">
                @{username} · {category?.name ?? "Category"}
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              New
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
