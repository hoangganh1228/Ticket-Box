
import moment from 'moment';
// format.helper.ts

// format không có giờ
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  // ép kiểu Date từ chuỗi ISO
  const date = new Date(dateString);

  // kiểm tra giá trị hợp lệ
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};


export const formatName = (name: string): string | undefined => {
  if (name === 'music') return 'Nhạc Sống';
  if (name === 'theatersandart') return 'Sân Khấu & Nghệ Thuật';
  if (name === 'sport') return 'Thể Thao';
  if (name === 'others') return 'Thể loại khác';
  if (name === 'Top picks for you') return 'Dành cho bạn';

  return undefined;
}


export function isEventPast(day: string | Date): boolean {
  const eventDate = new Date(day);
  const now = new Date();
  return eventDate < now;
}



// Lấy ngày
export function getDay(isoDate: string): number {
  return moment(isoDate).date(); // 1–31
}

// Lấy tháng
export function getMonth(isoDate: string): number {
  return moment(isoDate).month() + 1; // 1–12 (moment bắt đầu từ 0)
}

// Lấy năm
export function getYear(isoDate: string): number {
  return moment(isoDate).year();
}
