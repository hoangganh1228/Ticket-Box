import React, { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import usePerformances from "./hooks/usePerformances";
import PerformanceList from "./components/PerformanceList";
import EmptyState from "./components/EmptyState";
import CreateTicketModal from "./components/CreateTicketModal";
import CopyTicketModal from "./components/CopyTicketModal";
import type { TicketType, Performance } from "./types";

interface Step2IntroductionProps {
  performances?: Performance[];
  performanceActions?: {
    create?: () => void;
    toggle?: (id: number) => void;
    remove?: (id: number) => void;
    update?: (id: number, updates: Partial<Performance>) => void;
    addTicket?: (performanceId: number, ticket: TicketType) => void;
    updateTicket?: (performanceId: number, ticketId: number, updates: Partial<TicketType>) => void;
    removeTicket?: (performanceId: number, ticketId: number) => void;
    copyTicket?: (fromTicketId: number, toPerformanceId: number) => void;
    copyMultipleTickets?: (fromTicketIds: number[], toPerformanceId: number) => void;
    clearPerformances?: () => void;
    resetTempIds?: () => void;
  };
}

export default function Step2Introduction({
  performances: propPerformances,
  performanceActions: propActions
}: Step2IntroductionProps) {
  // Chỉ khởi tạo hook khi KHÔNG có props
  const useLocal = !propPerformances || !propActions;
  const local = useLocal ? usePerformances() : null;

  const finalPerformances = useLocal ? local!.performances : (propPerformances || []);
  const finalActions = useLocal ? local!.actions : (propActions || {});
  
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedPerformanceId, setSelectedPerformanceId] = useState<number | null>(null);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showCopyTicketModal, setShowCopyTicketModal] = useState(false);
  const [copyToPerformanceId, setCopyToPerformanceId] = useState<number | null>(null);

  const openTicketModal = useCallback((performanceId: number) => {
    setSelectedPerformanceId(performanceId);
    setIsEditMode(false);
    setEditingTicket(null);
    setShowTicketModal(true);
  }, []);

  const closeTicketModal = useCallback(() => {
    setShowTicketModal(false);
    setSelectedPerformanceId(null);
    setIsEditMode(false);
    setEditingTicket(null);
  }, []);

  const handleTicketSubmit = useCallback((ticketPayload: TicketType) => {
    if (selectedPerformanceId) {
      if (isEditMode && ticketPayload.id) {
        // Chế độ chỉnh sửa - cập nhật vé hiện tại
        finalActions.updateTicket?.(selectedPerformanceId, ticketPayload.id, ticketPayload);
      } else {
        // Chế độ tạo mới - thêm vé mới
        finalActions.addTicket?.(selectedPerformanceId, ticketPayload);
      }
      closeTicketModal();
    }
  }, [selectedPerformanceId, isEditMode, finalActions, closeTicketModal]);

  const openCopyTicketModal = useCallback((performanceId: number) => {
    setCopyToPerformanceId(performanceId);
    setShowCopyTicketModal(true);
  }, []);

  const closeCopyTicketModal = useCallback(() => {
    setShowCopyTicketModal(false);
    setCopyToPerformanceId(null);
  }, []);

  const handleCopyTicket = useCallback((ticketIds: number[]) => {
    if (copyToPerformanceId && ticketIds.length > 0) {
      // Sử dụng copyMultipleTickets để đảm bảo mỗi vé có ID riêng biệt
      finalActions.copyMultipleTickets?.(ticketIds, copyToPerformanceId);
      closeCopyTicketModal();
    }
  }, [copyToPerformanceId, finalActions, closeCopyTicketModal]);

  const handleEditTicket = useCallback((performanceId: number, ticketId: number) => {
    // Tìm vé cần chỉnh sửa
    const performance = finalPerformances.find(p => p.id === performanceId);
    const ticket = performance?.ticketTypes.find(t => t.id === ticketId);
    
    if (ticket) {
      setSelectedPerformanceId(performanceId);
      setEditingTicket(ticket);
      setIsEditMode(true);
      setShowTicketModal(true);
    }
  }, [finalPerformances]);

  const handleRemoveTicket = useCallback((performanceId: number, ticketId: number) => {
    finalActions.removeTicket?.(performanceId, ticketId);
  }, [finalActions]);

  const handleClearAll = useCallback(() => {
    finalActions.clearPerformances?.();
    finalActions.resetTempIds?.();
    // Also clear localStorage manually
    if (typeof window !== 'undefined') {
      const eventId = window.location.pathname.split('/').pop();
      if (eventId) {
        localStorage.removeItem(`performances_${eventId}`);
        console.log("Manually cleared localStorage for eventId:", eventId);
      }
    }
  }, [finalActions]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-white text-xl font-semibold">Thời Gian</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleClearAll}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Xóa tất cả
          </button>
          <button 
            onClick={() => finalActions.clearPerformances?.()}
            className="bg-gray-600 text-white px-4 py-2 rounded text-sm"
          >
            Tắt cả
          </button>
        </div>
      </div>

      {/* Empty state / List */}
      {finalPerformances.length === 0 ? (
        <EmptyState onCreate={finalActions.create || (() => {})} />
      ) : (
        <PerformanceList
          performances={finalPerformances}
          onToggle={finalActions.toggle || (() => {})}
          onRemove={finalActions.remove || (() => {})}
          onUpdate={finalActions.update || (() => {})}
          onOpenTicketModal={openTicketModal}
          onEditTicket={handleEditTicket}
          onRemoveTicket={handleRemoveTicket}
          onCopyTicket={openCopyTicketModal}
        />
      )}

      {/* Thêm suất diễn */}
      <button onClick={finalActions.create || (() => {})} className="flex items-center text-green-500 hover:text-green-400">
        <Plus className="w-5 h-5 mr-2" />
        Tạo suất diễn
      </button>

      {/* Modal vé */}
      <CreateTicketModal
        open={showTicketModal}
        onClose={closeTicketModal}
        onSubmit={handleTicketSubmit}
        editTicket={editingTicket}
        isEditMode={isEditMode}
      />

      {/* Modal copy vé */}
      <CopyTicketModal
        open={showCopyTicketModal}
        onClose={closeCopyTicketModal}
        onCopy={handleCopyTicket}
        performances={finalPerformances}
        currentPerformanceId={copyToPerformanceId || 0}
      />
    </div>
  );
}