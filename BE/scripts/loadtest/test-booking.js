import http from "k6/http";
import { check, sleep } from "k6";
import exec from "k6/execution";

export const options = {
vus: 5000, // số user ảo đồng thời
  duration: "3m", // thời gian chạy test
  thresholds: {
    http_req_failed: ["rate<0.05"], // <5% request fail
    http_req_duration: ["p(95)<2000"], // 95% req < 2s
  },
};

export default function () {
  const url = "http://host.docker.internal:3000/events/7/booking";

  // userId tăng dần theo mỗi request
  const userId = exec.scenario.iterationInTest + 1;

  const payload = JSON.stringify({
    userId: userId, // thêm userId auto increment
    event_id: 7,
    discount_amount: 10,
    items: [
      { ticket_id: 1, show_id: 1, quantity: 1, unit_price: 2000 },
      { ticket_id: 2, show_id: 1, quantity: 1, unit_price: 1000 },
    ],
    phone: `0123456${__VU}${__ITER}`,
    email: `user${__VU}${__ITER}@example.com`,
    address: `${__VU} Main St`,
    note: `Ghi chú đơn hàng ${__VU}-${__ITER}`,
  });

  const headers = { "Content-Type": "application/json" };
  const res = http.post(url, payload, { headers });

  check(res, { "status is 201": (r) => r.status === 201 });

  sleep(1); // nghỉ 1s giữa các vòng lặp
}
