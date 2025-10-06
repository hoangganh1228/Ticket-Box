/**
 * Helper function để convert form data với files thành FormData cho API
 */

export interface EventFormDataWithFiles {
  name: string;
  description?: string;
  thumbnailFile?: File | null;
  bannerFile?: File | null;
  slug?: string;
  type: string;
  status: string;
  name_address: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  category_id: number;
  org_name: string;
  org_description: string;
  orgThumbnailFile?: File | null;
}

/**
 * Convert event form data với files thành FormData để gửi API
 */
export const createEventFormData = (data: EventFormDataWithFiles): FormData => {
  const formData = new FormData();

  // Thêm text fields - đảm bảo không null/undefined
  if (data.name && data.name.trim()) formData.append('name', data.name.trim());
  if (data.description && data.description.trim()) formData.append('description', data.description.trim());
  if (data.slug && data.slug.trim()) formData.append('slug', data.slug.trim());
  if (data.type && data.type.trim()) formData.append('type', data.type.trim());
  if (data.status && data.status.trim()) formData.append('status', data.status.trim());
  if (data.name_address && data.name_address.trim()) formData.append('name_address', data.name_address.trim());
  if (data.province && data.province.trim()) formData.append('province', data.province.trim());
  if (data.district && data.district.trim()) formData.append('district', data.district.trim());
  if (data.ward && data.ward.trim()) formData.append('ward', data.ward.trim());
  if (data.street && data.street.trim()) formData.append('street', data.street.trim());
  if (data.category_id) formData.append('category_id', data.category_id.toString());
  if (data.org_name && data.org_name.trim()) formData.append('org_name', data.org_name.trim());
  if (data.org_description && data.org_description.trim()) formData.append('org_description', data.org_description.trim());

  // Thêm file fields - đảm bảo file tồn tại trước khi append
  if (data.thumbnailFile && data.thumbnailFile instanceof File) {
    formData.append('thumbnail', data.thumbnailFile, data.thumbnailFile.name);
  }
  if (data.bannerFile && data.bannerFile instanceof File) {
    formData.append('banner', data.bannerFile, data.bannerFile.name);
  }
  if (data.orgThumbnailFile && data.orgThumbnailFile instanceof File) {
    formData.append('org_thumbnail', data.orgThumbnailFile, data.orgThumbnailFile.name);
  }

  return formData;
};

/**
 * Update event với files
 */
export const createUpdateEventFormData = (data: Partial<EventFormDataWithFiles>): FormData => {
  const formData = new FormData();

  // Chỉ thêm các field có giá trị và không rỗng
  if (data.name && data.name.trim()) formData.append('name', data.name.trim());
  if (data.description !== undefined && data.description.trim()) formData.append('description', data.description.trim());
  if (data.slug && data.slug.trim()) formData.append('slug', data.slug.trim());
  if (data.type && data.type.trim()) formData.append('type', data.type.trim());
  if (data.status && data.status.trim()) formData.append('status', data.status.trim());
  if (data.name_address && data.name_address.trim()) formData.append('name_address', data.name_address.trim());
  if (data.province && data.province.trim()) formData.append('province', data.province.trim());
  if (data.district && data.district.trim()) formData.append('district', data.district.trim());
  if (data.ward && data.ward.trim()) formData.append('ward', data.ward.trim());
  if (data.street && data.street.trim()) formData.append('street', data.street.trim());
  if (data.category_id !== undefined) formData.append('category_id', data.category_id.toString());
  if (data.org_name && data.org_name.trim()) formData.append('org_name', data.org_name.trim());
  if (data.org_description && data.org_description.trim()) formData.append('org_description', data.org_description.trim());

  // Thêm file fields nếu có - đảm bảo file tồn tại trước khi append
  if (data.thumbnailFile && data.thumbnailFile instanceof File) {
    formData.append('thumbnail', data.thumbnailFile, data.thumbnailFile.name);
  }
  if (data.bannerFile && data.bannerFile instanceof File) {
    formData.append('banner', data.bannerFile, data.bannerFile.name);
  }
  if (data.orgThumbnailFile && data.orgThumbnailFile instanceof File) {
    formData.append('org_thumbnail', data.orgThumbnailFile, data.orgThumbnailFile.name);
  }

  return formData;
};
