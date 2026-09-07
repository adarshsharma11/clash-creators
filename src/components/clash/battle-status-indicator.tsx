import { BattleStatus } from "@/types/battle";
import { StatusBadge } from "@/components/ui/status-badge";

interface BattleStatusIndicatorProps {
  status: BattleStatus;
}

export function BattleStatusIndicator({ status }: BattleStatusIndicatorProps) {
  if (status === "ending") {
    return <StatusBadge status="LIVE" />;
  }
  if (status === "completed") {
    return <StatusBadge status="COMPLETED" />;
  }
  if (status === "live") {
    return <StatusBadge status="LIVE" />;
  }
  return <StatusBadge status="UPCOMING" />;
}
