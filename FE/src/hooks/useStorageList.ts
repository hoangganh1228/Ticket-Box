// hooks/useStorageList.ts
import { useState, useEffect } from "react";

type UseStorageListReturn = {
  list: string[];
  addItem: (item: string) => void;
};

export function useStorageList(key: string, limit = 3): UseStorageListReturn {
  const [list, setList] = useState<string[]>([]);

  // Load list từ localStorage khi mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return; // nếu null hoặc rỗng thì giữ list là []
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // chỉ giữ các phần tử là string và áp giới hạn
        setList(parsed.filter(x => typeof x === "string").slice(0, limit));
      }
    } catch (err) {
      console.error("useStorageList: failed to read/parse localStorage", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const addItem = (item: string) => {
    const term = item?.trim();
    if (!term) return;

    setList(prev => {
      const updated = [term, ...prev.filter(p => p !== term)].slice(0, limit);
      try {
        localStorage.setItem(key, JSON.stringify(updated));
      } catch (err) {
        console.error("useStorageList: failed to save to localStorage", err);
      }
      return updated;
    });
  };

  return { list, addItem };
}
