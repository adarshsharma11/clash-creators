import { BattleStatus } from "@/types/battle";
import { Badge } from "@/components/ui/badge";
import { Flame, Clock, Trophy, CalendarClock } from "lucide-react";

interface BattleStatusIndicatorProps {
  status: BattleStatus;
}

export function BattleStatusIndicator({ status }: BattleStatusIndicatorProps) {
  switch (status) {
    case "live":
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 uppercase flex items-center gap-1.5 px-3 py-1">
          <Flame className="h-3.5 w-3.5 fill-current" /> LIVE
        </Badge>
      );
    case "ending":
      return (
        <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 uppercase flex items-center gap-1.5 px-3 py-1 animate-pulse">
          <Clock className="h-3.5 w-3.5" /> FINAL MINUTES
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 uppercase flex items-center gap-1.5 px-3 py-1">
          <Trophy className="h-3.5 w-3.5" /> CLASH COMPLETE
        </Badge>
      );
    case "scheduled":
    default:
      return (
        <Badge variant="secondary" className="uppercase flex items-center gap-1.5 px-3 py-1">
          <CalendarClock className="h-3.5 w-3.5" /> SCHEDULED
        </Badge>
      );
  }
}
