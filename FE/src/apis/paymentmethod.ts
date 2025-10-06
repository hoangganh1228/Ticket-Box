import axios from '@/src/config/axios.config'

export const fetchPaymentMethodApi = async () => {
    const response = await axios.get('/payment-methods');
    return response.data;
}