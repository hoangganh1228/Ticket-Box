import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek); // mở rộng để dùng tuần theo ISO (thứ 2 là đầu tuần)

// Hàm lấy params cho API
export function getEventParams(type: 'this-weekend' | 'this-month') {
  const now = dayjs();

  if (type === 'this-weekend') {
    // Giả sử cuối tuần là thứ 6 -> chủ nhật
    const dayOfWeek = now.isoWeekday(); // Thứ 2 = 1 ... Chủ nhật = 7
    const friday = now.add(5 - dayOfWeek, 'day'); // tìm thứ 6 của tuần này
    const sunday = friday.add(2, 'day'); // chủ nhật

    return {
      at: 'this-weekend',
      from: friday.format('YYYY-MM-DD'),
      to: sunday.format('YYYY-MM-DD'),
    };
  }

  if (type === 'this-month') {
    const firstDay = now.startOf('month');
    const lastDay = now.endOf('month');

    return {
      at: 'this-month',
      from: firstDay.format('YYYY-MM-DD'),
      to: lastDay.format('YYYY-MM-DD'),
    };
  }

  throw new Error('Unknown type');
}