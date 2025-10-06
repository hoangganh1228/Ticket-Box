import React from "react";
import type { Performance } from "../types";
import PerformanceCard from "./PerformanceCard";

type Props = {
  performances: Performance[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Performance>) => void;
  onOpenTicketModal: (performanceId: number) => void;
  onEditTicket?: (performanceId: number, ticketId: number) => void;
  onRemoveTicket?: (performanceId: number, ticketId: number) => void;
  onCopyTicket?: (performanceId: number) => void;
};

export default function PerformanceList({
  performances,
  onToggle,
  onRemove,
  onUpdate,
  onOpenTicketModal,
  onEditTicket,
  onRemoveTicket,
  onCopyTicket,
}: Props) {
  return (
    <div className="space-y-4">
      {performances.map((perf) => (
        <PerformanceCard
          key={perf.id}
          perf={perf}
          onToggle={onToggle}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onCreateTicket={onOpenTicketModal}
          onRemoveTicket={onRemoveTicket || ((performanceId, ticketId) => {
            console.log("Remove ticket:", performanceId, ticketId);
          })}
          onEditTicket={onEditTicket}
          onCopyTicket={onCopyTicket}
        />
      ))}
    </div>
  );
}