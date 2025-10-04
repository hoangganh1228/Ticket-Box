import { registerAs } from '@nestjs/config';

export default registerAs('payments', () => ({
  momo: {
    endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
    partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
    accessKey: process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85',
    secretKey: process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    redirectUrl: process.env.MOMO_REDIRECT_URL || 'https://webhook.site/your-id',
    ipnUrl: process.env.MOMO_IPN_URL || 'https://webhook.site/your-id',
  },
}));