'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBookingTTLApi, TTLResponse } from '@/src/apis/booking';
import { getOrderFromCacheApi, GetOrderResponse } from '@/src/apis/order';

interface UseOrderValidationProps {
  eventId: string | number;
  orderNumber: string | null;
  redirectPath?: string;
}

interface OrderValidationState {
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
  ttl: TTLResponse['data'] | null;
  order: GetOrderResponse['data'] | null;
  remainingSeconds: number;
  isExpired: boolean;
}

export const useOrderValidation = ({
  eventId,
  orderNumber,
  redirectPath
}: UseOrderValidationProps): OrderValidationState => {
  const router = useRouter();
  const [state, setState] = useState<OrderValidationState>({
    isValid: false,
    isLoading: true,
    error: null,
    ttl: null,
    order: null,
    remainingSeconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!orderNumber || !eventId) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isValid: false,
        error: 'Thiếu thông tin orderNumber hoặc eventId'
      }));
      return;
    }

    let mounted = true;

    const validateOrder = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Gọi API kiểm tra TTL và lấy thông tin order
        const [ttlRes, orderRes] = await Promise.all([
          getBookingTTLApi(eventId, orderNumber),
          getOrderFromCacheApi(orderNumber),
        ]);

        if (!mounted) return;

        const ttlData = ttlRes?.data;
        const orderData = orderRes?.data;

        // Kiểm tra nếu order đã hết hạn
        if (ttlData?.isExpired || ttlData?.status === 'EXPIRED' || ttlData?.remainingSeconds <= 0) {
          setState(prev => ({
            ...prev,
            isValid: false,
            isLoading: false,
            isExpired: true,
            error: 'Đơn hàng đã hết hạn',
            ttl: ttlData,
            order: orderData,
          }));

          // Redirect về trang select-ticket
          const redirectTo = redirectPath || `/events/${eventId}/bookings/${eventId}/select-ticket`;
          router.push(redirectTo);
          return;
        }

        // Order hợp lệ
        setState(prev => ({
          ...prev,
          isValid: true,
          isLoading: false,
          isExpired: false,
          error: null,
          ttl: ttlData,
          order: orderData,
          remainingSeconds: ttlData?.remainingSeconds || 0,
        }));

      } catch (error) {
        if (!mounted) return;

        console.error('Lỗi khi validate order:', error);
        
        // Nếu API trả về lỗi, có thể order đã hết hạn hoặc không tồn tại
        setState(prev => ({
          ...prev,
          isValid: false,
          isLoading: false,
          isExpired: true,
          error: 'Không thể xác thực đơn hàng. Có thể đơn hàng đã hết hạn.',
        }));

        // Redirect về trang select-ticket
        const redirectTo = redirectPath || `/events/${eventId}/bookings/${eventId}/select-ticket`;
        router.push(redirectTo);
      }
    };

    validateOrder();

    return () => {
      mounted = false;
    };
  }, [eventId, orderNumber, router, redirectPath]);

  // Countdown timer
    // Countdown từ expiresAt + cập nhật khi tab trở lại
  useEffect(() => {
    if (!state.isValid || !state.ttl?.expiresAt) return;

    const compute = () => {
      const diff = new Date(state.ttl!.expiresAt).getTime() - Date.now();
      const remain = Math.max(0, Math.floor(diff / 1000));

      if (remain <= 0) {
        if (orderNumber) {
          getBookingTTLApi(eventId, orderNumber).catch(() => {});
        }
        const redirectTo = redirectPath || `/events/${eventId}/bookings/${eventId}/select-ticket`;
        router.push(redirectTo);
        setState(prev => ({ ...prev, remainingSeconds: 0, isExpired: true, isValid: false }));
        return;
      }

      setState(prev => ({ ...prev, remainingSeconds: remain }));
    };

    compute();
    const id = setInterval(compute, 1000);

    const onWake = () => compute();
    window.addEventListener('visibilitychange', onWake);
    window.addEventListener('focus', onWake);

    return () => {
      clearInterval(id);
      window.removeEventListener('visibilitychange', onWake);
      window.removeEventListener('focus', onWake);
    };
  }, [state.isValid, state.ttl?.expiresAt, router, eventId, redirectPath, orderNumber]);

  return state;
};
