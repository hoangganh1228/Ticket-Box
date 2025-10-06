// src/components/modal/CancelOrderModal.tsx
'use client';

import { Modal } from 'antd';
import React from 'react';

type CancelOrderModalProps = {
  open: boolean;
  onOk: () => void;        
  onCancel: () => void;
  onCloseIcon?: () => void;
};

export default function CancelOrderModal({
  open,
  onOk,
  onCancel,
  onCloseIcon,
}: CancelOrderModalProps) {
  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      maskClosable={false}
      style={{ top: '350px' }}
      okText="Ở lại"
      cancelText="Hủy Đơn"
      okButtonProps={{
        style: {
          background: 'rgb(45,194,117)',
          border: '1px solid transparent',
          borderRadius: '4px',
        },
      }}
      cancelButtonProps={{
        style: {
          color: 'rgb(255,68,78)',
          border: '1px solid rgb(255,66,78)',
          borderRadius: '4px',
        },
      }}
      closeIcon={
        <span
          onClick={(e) => {
            e.stopPropagation();
            onCloseIcon?.();
          }}
        >
          ❌
        </span>
      }
    >
      <div className="font-bold text-base leading-6 text-[rgb(42,45,52)] text-center mb-2">
        Hủy Đơn hàng
      </div>
      <div className="font-normal text-sm leading-5 text-center">
        <div className="text-left py-1 px-[10px]">
          Bạn có chắc chắn muốn tiếp tục?
          <ul className="list-disc mx-[10px]">
            <li>Bạn sẽ mất vị trí mình đã lựa chọn.</li>
            <li>
              Đơn hàng đang trong quá trình thanh toán hoặc đã thanh toán thành
              công cũng có thể bị huỷ.
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}