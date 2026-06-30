import React from "react";
import { TimelineLayout } from "./TimelineLayout";
import { GridLayout } from "./GridLayout";
import { CompactListLayout } from "./CompactListLayout";
import type { PlanSegment } from "../../data/curriculum";

interface LayoutRegistryProps {
  layoutType?: string;
  segmentType?: string;
  segments: PlanSegment[];
  filteredSegments: PlanSegment[];
  primaryPlan: any;
  getSegmentStatus: (segment: PlanSegment, index: number) => string;
  getSegmentProgress: (segment: PlanSegment) => number;
  toggleExpand: (segmentId: string) => void;
  expandedWeeks: Record<string, boolean>;
  togglePlanWeek: (planId: string, segmentId: string) => void;
}

export const LayoutRegistry: React.FC<LayoutRegistryProps> = (props) => {
  switch (props.layoutType) {
    case "grid":
      return <GridLayout {...props} />;
    case "compact-list":
      return <CompactListLayout {...props} />;
    case "timeline":
    default:
      return <TimelineLayout {...props} />;
  }
};
