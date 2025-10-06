type OrderStatusText = {
    text: string;
    className: string;
};

export const getTextOrderStatus = (status: string): OrderStatusText => {
    const success = ['paid', 'confirmed'];
    const pending = ['pending'];
    const failed = ['cancelled', 'expired', 'refunded', 'failed'];

    if (success.includes(status)) {
        return { text: 'Thành công', className: 'bg-green-700 text-white' };
    }
    if (pending.includes(status)) {
        return { text: 'Đang xử lý', className: 'bg-yellow-500 text-white' };
    }
    if (failed.includes(status)) {
        return { text: 'Thất bại', className: 'bg-red-600 text-white' };
    }
    return { text: 'Không xác định', className: 'bg-gray-500 text-white' };
};
