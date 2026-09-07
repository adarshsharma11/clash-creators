"use client";

import { Modal } from "@/components/ui/modal";
import { JoinClashCard } from "@/components/clash/join-clash-card";

interface JoinClashModalProps {
  open: boolean;
  onClose: () => void;
  clashId?: string;
}

export function JoinClashModal({ open, onClose, clashId }: JoinClashModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Join Today's Clash"
      description="Enter your creator details and get in the battle."
    >
      {open ? <JoinClashCard variant="modal" clashId={clashId} /> : null}
    </Modal>
  );
}
