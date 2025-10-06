import axiosInstance from '@/src/config/interceptor';

export interface VerifyTurnstileResponse {
  success: boolean;
  statusCode?: number;
  data?: { isValid: boolean };
  message?: string;
}

export const verifyTurnstileApi = async (token: string): Promise<VerifyTurnstileResponse> => {
  const res = await axiosInstance.post('/security/turnstile/verify', { token });
  return res.data;
};


