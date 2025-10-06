/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getTicketsByShowApi } from '../apis/shows';
import { fetchCartByBookingCodeApi } from '../apis/cart';

// Định nghĩa type cho tham số
type SWRKey = string | any[] | null;
type FetcherFn = (...args: any[]) => Promise<any>;

export const useFetch = (
  key: SWRKey,
  fetcher: FetcherFn,
  options: SWRConfiguration = {},
  redirectIfEmpty: string = '/'
): SWRResponse => {
  const router = useRouter();

  
  useEffect(() => {
    if (!key) {
      router.push(redirectIfEmpty);
    }
    if (Array.isArray(key) && key.some((k) => k === null || k === undefined || k === '')) {
      router.push(redirectIfEmpty);
    }
  }, [key, router, redirectIfEmpty]);

  return useSWR(key, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
    ...options,
  });
};

export const fetchEventByShowId = async (showId: string) => {
    const res = await getTicketsByShowApi(showId);
    return res.data;
};

export const fetchCartByBookingCode = async (booking_code : string | null , ShowId : string) => {
    const res = await fetchCartByBookingCodeApi(booking_code, ShowId);
    return res.data;
}
