// scripts/booking-payment-load.js
const axios = require('axios');

const CONFIG = {
  BOOKING_BASE_URL: process.env.BOOKING_BASE_URL || 'http://localhost:3000',
  PAYMENT_BASE_URL: process.env.PAYMENT_BASE_URL || 'http://localhost:3000',
  EVENT_ID: Number(process.env.EVENT_ID || 7),
  TOTAL_REQUESTS: Number(process.env.TOTAL_REQUESTS || 1000),
  BOOKING_CONCURRENCY: Number(process.env.BOOKING_CONCURRENCY || 300),
  PAYMENT_CONCURRENCY: Number(process.env.PAYMENT_CONCURRENCY || 200),
  TIMEOUT: Number(process.env.REQUEST_TIMEOUT || 30000),
  RETRY: Number(process.env.RETRY || 1),
};

const BOOKING_DATA_TEMPLATE = () => ({
  event_id: CONFIG.EVENT_ID,
  discount_amount: 10,
  items: [
    { ticket_id: 1, show_id: 1, quantity: 1, unit_price: 2000, special_requests: 'Note A' },
    { ticket_id: 2, show_id: 1, quantity: 1, unit_price: 1000, special_requests: 'Note B' },
  ],
  phone: '0123456789',
  email: 'bosamday1@gmail.com',
  address: '123 Main St',
  note: 'Ghi chú đơn hàng',
});

const PAYMENT_BODY = { currency: 'VND', provider: 'MOCKBANK', method: 'CARD' };

const client = axios.create({ timeout: CONFIG.TIMEOUT });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, retry = CONFIG.RETRY) {
  let lastErr;
  for (let i = 0; i <= retry; i++) {
    try { return await fn(); } catch (e) { lastErr = e; await sleep(100 + i * 200); }
  }
  throw lastErr;
}

async function createBooking() {
  const url = `${CONFIG.BOOKING_BASE_URL}/events/${CONFIG.EVENT_ID}/booking`;
  const payload = BOOKING_DATA_TEMPLATE();
  const res = await withRetry(() => client.post(url, payload));
  const data = res?.data?.data;
  if (!data?.orderNumber) throw new Error(`Missing orderNumber: ${JSON.stringify(res.data)}`);
  return { orderNumber: data.orderNumber, bookingId: data.bookingId, expiresAt: data.expiresAt };
}

async function payOrder(orderNumber) {
  const url = `${CONFIG.PAYMENT_BASE_URL}/orders/${orderNumber}/payment`;
  const res = await withRetry(() => client.post(url, PAYMENT_BODY));
  return res.data;
}

async function runPhase(label, total, concurrency, taskFactory) {
  console.log(`==> ${label}: total=${total}, concurrency=${concurrency}`);
  let inFlight = 0, i = 0, ok = 0, fail = 0;
  const results = [];
  return new Promise((resolve) => {
    const launch = () => {
      while (inFlight < concurrency && i < total) {
        const idx = i++; inFlight++;
        taskFactory(idx)
          .then((r) => { ok++; results.push({ ok: true, data: r }); })
          .catch((e) => { fail++; results.push({ ok: false, error: e }); })
          .finally(() => {
            inFlight--;
            if (i < total) launch();
            else if (inFlight === 0) {
              console.log(`==> ${label} done: ok=${ok}, fail=${fail}`);
              resolve(results);
            }
          });
      }
    };
    launch();
  });
}

async function main() {
  // Phase 1: Booking
  const bookingResults = await runPhase(
    'Booking phase',
    CONFIG.TOTAL_REQUESTS,
    CONFIG.BOOKING_CONCURRENCY,
    () => createBooking()
  );

  const successful = bookingResults.filter(r => r.ok).map(r => r.data);
  console.log(`Collected ${successful.length} orderNumbers`);

  // Optional: small pause
  await sleep(500);

  // Phase 2: Payment (filter those not expired)
  const now = Date.now();
  const valid = successful.filter(x => {
    const ttl = new Date(x.expiresAt).getTime() - now;
    return ttl > 15_000; // an toàn còn >15s mới thanh toán
  });

  console.log(`Proceeding to payment for ${valid.length} (filtered by TTL safety)`);
  const paymentResults = await runPhase(
    'Payment phase',
    valid.length,
    CONFIG.PAYMENT_CONCURRENCY,
    (idx) => payOrder(valid[idx].orderNumber)
  );

  const paidOk = paymentResults.filter(r => r.ok).length;
  const paidFail = paymentResults.length - paidOk;

  console.log(`SUMMARY:
  Booking ok=${successful.length} / ${CONFIG.TOTAL_REQUESTS}
  Payment ok=${paidOk} / ${paymentResults.length}
  Dropped (TTL safety)=${successful.length - valid.length}`);
}

if (require.main === module) {
  main().catch(e => {
    if (e.response) console.error('HTTP Error:', e.response.status, e.response.data);
    else console.error(e);
    process.exit(1);
  });
}

module.exports = { main };