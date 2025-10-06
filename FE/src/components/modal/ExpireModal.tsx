// components/ExpireModal.tsx
'use client';

import { Modal } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import React from 'react';

type ExpireModalProps = {
  open: boolean;
  onOk: () => void; 
};

export default function ExpireModal({ open, onOk }: ExpireModalProps) {
  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      style={{ top: '350px' }}
    >
      <div className="font-bold text-base leading-6 text-[rgb(42,45,52)] text-center mb-2">
        Hết thời gian giữ vé!
      </div>
      <div className="py-2 text-center flex justify-center items-center flex-col gap-3">
        <BellOutlined className="text-[30px] text-inherit " />
        <p className="px-5">
          Đã hết thời gian giữ vé. Vui lòng đặt lại vé mới.
        </p>
      </div>
      {/* footer custom */}
      <div className="flex justify-center mt-4">
        <button
          onClick={onOk}
          className="bg-[rgb(45,194,117)] text-white px-6 py-2 rounded-md"
        >
          Đặt vé mới
        </button>
      </div>
    </Modal>
  );
}
