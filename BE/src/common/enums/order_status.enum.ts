export enum ORDER_STATUS {
  PENDING = 'pending',      // Chờ thanh toán
  PAID = 'paid',           // Đã thanh toán
  CONFIRMED = 'confirmed', // Đã xác nhận
  CANCELLED = 'cancelled', // Đã hủy
  EXPIRED = 'expired',     // Hết hạn
  REFUNDED = 'refunded',   // Đã hoàn tiền
  FAILED = 'failed',       // Thất bại
}