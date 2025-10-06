/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Modal } from "antd";

interface CartPendingModalProps {
  open: boolean;
  cart: any;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  onContinue: () => void;
  onCancel: () => void;
}

export default function CartPendingModal({
  open,
  cart,
  minutes,
  seconds,
  isExpired,
  onContinue,
  onCancel,
}: CartPendingModalProps) {
  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      centered
      width={400}
    >
      <h3 className="text-base font-bold mb-2">Đơn hàng chưa hoàn thành</h3>
      <p className="text-sm mb-3">
        Bạn đang có đơn hàng chưa hoàn tất.<br />
        Bạn có muốn tiếp tục?
      </p>

      <ul className="text-sm mb-4 text-left list-disc list-inside">
        {cart?.items?.map((item: any, idx: number) => (
          <li key={idx}>
            {item.quantity} x {item.ticket?.name}
          </li>
        ))}
      </ul>

      {/* Nút quay lại đơn cũ */}
      <button
        onClick={onContinue}
        disabled={isExpired}
        className="w-full bg-green-500 text-white font-semibold py-2 rounded mb-3 hover:bg-green-600 disabled:bg-gray-400"
      >
        Quay lại đơn cũ{" "}
        {!isExpired &&
          `(${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")})`}
      </button>

      {/* Nút hủy đơn */}
      <button
        onClick={onCancel}
        className="w-full text-green-600 font-semibold py-2 rounded hover:text-green-700"
      >
        Hủy đơn, Mua vé mới
      </button>
    </Modal>
  );
}