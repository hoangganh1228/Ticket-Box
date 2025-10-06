// scripts/booking-payment-test.js
const axios = require('axios');

const CONFIG = {
  BASE_URL: 'http://localhost:3000',
  EVENT_ID: 3,
  TOTAL_REQUESTS: 100,
  CONCURRENCY: 20,
  TIMEOUT: 30000,
};

const client = axios.create({
  baseURL: CONFIG.BASE_URL,
  timeout: CONFIG.TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

const buildBookingBody = (userId) => ({
  event_id: CONFIG.EVENT_ID,
  discount_amount: 0,
  items: [
    { ticket_id: 3, show_id: 3, unit_price: 2000, quantity: 4, special_requests: 'Ghi chú cho vé này! HEHEHE' },
    { ticket_id: 4, show_id: 3, unit_price: 10000, quantity: 4, special_requests: 'Ghi chú cho vé ưu đãi! HEHEHE' },
  ],
  phone: `0123456${userId.toString().padStart(4, '0')}`,
  email: `bosamday1@gmail.com`,
  address: `${userId} Main St`,
  note: `Ghi chú đơn hàng ${userId}`,
  userId, // nếu controller có hỗ trợ lấy userId từ body
});

async function bookThenPay(userId) {
  // 1) Booking
  const bookingRes = await client.post(
    `/events/${CONFIG.EVENT_ID}/booking`,
    buildBookingBody(userId),
  );

  const data = bookingRes.data?.data;
  if (!data?.orderNumber) {
    throw new Error(`Booking response thiếu orderNumber: ${JSON.stringify(bookingRes.data)}`);
  }

  // 2) Payment ngay sau khi booking
  const PROVIDERS = ['vietcombank', 'bidv', 'viettinbank', 'agribank', 'techcombank'];
  const METHODS = ['card', 'ewallet', 'bank_transfer', 'qr'];
  const paymentBody = {
    currency: 'VND',
    provider: PROVIDERS[Math.floor(Math.random() * PROVIDERS.length)],
    method: METHODS[Math.floor(Math.random() * METHODS.length)],
  };
  const payRes = await client.post(`/orders/${data.orderNumber}/payment`, paymentBody);

  return {
    userId,
    booking: {
      bookingId: data.bookingId,
      orderNumber: data.orderNumber,
      status: data.status,
      expiresAt: data.expiresAt,
    },
    payment: payRes.data,
  };
}

async function run() {
  let inFlight = 0, nextUserId = 1, ok = 0, fail = 0;

  await new Promise((resolve) => {
    const launch = () => {
      while (inFlight < CONFIG.CONCURRENCY && nextUserId <= CONFIG.TOTAL_REQUESTS) {
        const userId = nextUserId++; // auto-increment userId
        inFlight++;

        bookThenPay(userId)
          .then(() => { ok++; })
          .catch((e) => {
            fail++;
            const code = e.response?.status || e.code || 'ERR';
            console.log(`User ${userId} failed: ${code}`, e.response?.data || e.message);
          })
          .finally(() => {
            inFlight--;
            if (nextUserId <= CONFIG.TOTAL_REQUESTS) launch();
            else if (inFlight === 0) resolve();
          });
      }
    };
    launch();
  });

  console.log(`Done. Success=${ok}, Failed=${fail}, Total=${CONFIG.TOTAL_REQUESTS}`);
}

if (require.main === module) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}