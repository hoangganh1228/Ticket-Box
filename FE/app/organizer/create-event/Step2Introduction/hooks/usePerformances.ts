import { useCallback, useState, useEffect, useMemo } from "react";
import { getEventShowings } from "@/src/apis/events";
import type { Performance, TicketType } from "../types";

export default function usePerformances(eventId?: string | number) {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [tempIdCounter, setTempIdCounter] = useState(1);
  const [tempTicketIdCounter, setTempTicketIdCounter] = useState(1);

  // Ưu tiên load từ API; localStorage chỉ là fallback
  useEffect(() => {
    const load = async () => {
      if (!eventId) return;

      try {
        const apiData = await getEventShowings(eventId);
        if (Array.isArray(apiData)) {
          const apiPerformances: Performance[] = apiData.map((show: any) => ({
            id: show.id,
            start_time: show.time_start,
            end_time: show.time_end,
            isOpen: true,
            ticketTypes: (show.tickets || []).map((t: any) => ({
              id: t.id,
              name: t.name,
              price: parseFloat(t.price),
              total_ticket: t.total_ticket,
              description: t.description,
              is_free: t.is_free,
              max_ticket: t.max_ticket,
              min_ticket: t.min_ticket,
              start_time: t.start_time,
              end_time: t.end_time,
            })),
          }));

          setPerformances(apiPerformances);
          // cập nhật counter để tránh đụng ID thật
          const maxShowId = Math.max(0, ...apiPerformances.map(p => p.id || 0));
          const maxTicketId = Math.max(0, ...apiPerformances.flatMap(p => p.ticketTypes.map(t => t.id || 0)));
          setTempIdCounter(maxShowId + 1);
          setTempTicketIdCounter(maxTicketId + 1);

          // backup local
          localStorage.setItem(`performances_${eventId}`, JSON.stringify(apiPerformances));
          return;
        }
      } catch (e) {
        // ignore → fallback local
      }

      // Fallback: localStorage
      const saved = localStorage.getItem(`performances_${eventId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Performance[];
          setPerformances(parsed);
        } catch {}
      } else {
        setPerformances([]);
      }
    };

    load();
  }, [eventId]);

  // Backup local khi thay đổi (không là nguồn dữ liệu chính)
  useEffect(() => {
    if (eventId) {
      localStorage.setItem(`performances_${eventId}`, JSON.stringify(performances));
    }
  }, [performances, eventId]);

  const create = useCallback(() => {
    const newPerformance: Performance = {
      id: -tempIdCounter,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isOpen: true,
      ticketTypes: [],
    };
    setTempIdCounter(prev => prev + 1);
    setPerformances(prev => [...prev, newPerformance]);
  }, [tempIdCounter]);

  const toggle = useCallback((id: number) => {
    setPerformances(prev => prev.map(p => p.id === id ? { ...p, isOpen: !p.isOpen } : p));
  }, []);

  const remove = useCallback((id: number) => {
    setPerformances(prev => prev.filter(p => p.id !== id));
  }, []);

  const update = useCallback((id: number, updates: Partial<Performance>) => {
    setPerformances(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const addTicket = useCallback((performanceId: number, ticket: TicketType) => {
    setPerformances(prev => prev.map(p =>
      p.id === performanceId
        ? { ...p, ticketTypes: [...p.ticketTypes, { ...ticket, id: -tempTicketIdCounter }] }
        : p
    ));
    setTempTicketIdCounter(prev => prev + 1);
  }, [tempTicketIdCounter]);

  const updateTicket = useCallback((performanceId: number, ticketId: number, updates: Partial<TicketType>) => {
    setPerformances(prev => prev.map(p =>
      p.id === performanceId
        ? { ...p, ticketTypes: p.ticketTypes.map(t => t.id === ticketId ? { ...t, ...updates } : t) }
        : p
    ));
  }, []);

  const removeTicket = useCallback((performanceId: number, ticketId: number) => {
    setPerformances(prev => prev.map(p =>
      p.id === performanceId
        ? { ...p, ticketTypes: p.ticketTypes.filter(t => t.id !== ticketId) }
        : p
    ));
  }, []);

  const copyTicket = useCallback((fromTicketId: number, toPerformanceId: number) => {
    setPerformances(prev => {
      let source: TicketType | null = null;
      for (const perf of prev) {
        const t = perf.ticketTypes.find(x => x.id === fromTicketId);
        if (t) { source = t; break; }
      }
      if (!source) return prev;

      const newTicket: TicketType = { ...source, id: -tempTicketIdCounter };
      return prev.map(p => p.id === toPerformanceId ? { ...p, ticketTypes: [...p.ticketTypes, newTicket] } : p);
    });
    setTempTicketIdCounter(prev => prev + 1);
  }, [tempTicketIdCounter]);

  const copyMultipleTickets = useCallback((fromTicketIds: number[], toPerformanceId: number) => {
    if (fromTicketIds.length === 0) return;
    setPerformances(prev => {
      const sourceTickets: TicketType[] = [];
      for (const id of fromTicketIds) {
        for (const perf of prev) {
          const found = perf.ticketTypes.find(t => t.id === id);
          if (found) { sourceTickets.push(found); break; }
        }
      }
      if (sourceTickets.length === 0) return prev;
      const cloned = sourceTickets.map((s, i) => ({ ...s, id: -(tempTicketIdCounter + i) }));
      return prev.map(p => p.id === toPerformanceId ? { ...p, ticketTypes: [...p.ticketTypes, ...cloned] } : p);
    });
    setTempTicketIdCounter(prev => prev + fromTicketIds.length);
  }, [tempTicketIdCounter]);

  const clearPerformances = useCallback(() => {
    setPerformances([]);
    if (eventId) localStorage.removeItem(`performances_${eventId}`);
  }, [eventId]);

  const resetTempIds = useCallback(() => {
    setTempIdCounter(1);
    setTempTicketIdCounter(1);
  }, []);

  const replaceAll = useCallback((items: Performance[]) => {
    setPerformances(items);
    const maxShowId = Math.max(0, ...items.map(p => p.id || 0));
    const maxTicketId = Math.max(0, ...items.flatMap(p => p.ticketTypes.map(t => t.id || 0)));
    setTempIdCounter(maxShowId + 1);
    setTempTicketIdCounter(maxTicketId + 1);
  }, []);

  return {
    performances,
    actions: useMemo(() => ({
      create,
      toggle,
      remove,
      update,
      addTicket,
      updateTicket,
      removeTicket,
      copyTicket,
      copyMultipleTickets,
      clearPerformances,
      resetTempIds,
      replaceAll
    }), [
      create, toggle, remove, update,
      addTicket, updateTicket, removeTicket,
      copyTicket, copyMultipleTickets,
      clearPerformances, resetTempIds
    ])
  };
}