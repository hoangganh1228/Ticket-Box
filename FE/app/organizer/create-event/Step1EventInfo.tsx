import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import RichTextEditor from "@/src/components/RichTextEditor";
import ImageUpload from "./components/ImageUpload";
import useVietnamAddress from "@/src/hooks/useVietnamAddress";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface ValidationErrors {
  thumbnail?: string;
  banner?: string;
  eventName?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  orgThumbnail?: string;
  orgName?: string;
  orgDescription?: string;
  venueName?: string;
  eventType?: string;
  categoryId?: string;
  description?: string;
}

interface EnhancedEventFormProps {
  // Basic event info
  eventName: string;
  setEventName: SetState<string>;
  eventType: string;
  setEventType: SetState<string>;
  venueName: string;
  setVenueName: SetState<string>;
  
  // Location details
  province: string;
  setProvince: SetState<string>;
  district: string;
  setDistrict: SetState<string>;
  ward: string;
  setWard: SetState<string>;
  street: string;
  setStreet: SetState<string>;
  
  // Event details
  categoryId: number;
  setCategoryId: SetState<number>;
  description: string;
  setDescription: SetState<string>;
  
  // Organization info
  orgName: string;
  setOrgName: SetState<string>;
  orgDescription: string;
  setOrgDescription: SetState<string>;
  
  // Image uploads
  thumbnail?: File | null;
  setThumbnail?: SetState<File | null>;
  banner?: File | null;
  setBanner?: SetState<File | null>;
  orgThumbnail?: File | null;
  setOrgThumbnail?: SetState<File | null>;
  
  // Validation props
  validationErrors?: ValidationErrors;
  onValidationChange?: (isValid: boolean) => void;
}

export default function EnhancedEventForm({
  eventName,
  eventType,
  setEventType,
  setEventName,
  venueName,
  setVenueName,
  province,
  setProvince,
  district,
  setDistrict,
  ward,
  setWard,
  street,
  setStreet,
  categoryId,
  setCategoryId,
  description,
  setDescription,
  orgName,
  setOrgName,
  orgDescription,
  setOrgDescription,
  thumbnail,
  setThumbnail,
  banner,
  setBanner,
  orgThumbnail,
  setOrgThumbnail,
  validationErrors = {},
  onValidationChange,
}: EnhancedEventFormProps) {
  const [localErrors, setLocalErrors] = useState<ValidationErrors>({});

  // Sẽ khởi tạo hook sau khi định nghĩa handleFieldChange

  const categories = [
    { value: 1, label: "Sân khấu & Nghệ thuật" },
    { value: 2, label: "Thể thao" },
    { value: 3, label: "Giáo dục" }
  ];

  // Real-time validation function
  const validateField = (fieldName: string, value: unknown): string | undefined => {
    const asString = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
    const asNumber = (v: unknown) => (typeof v === 'number' ? v : Number(v));
    switch (fieldName) {
      case 'thumbnail':
        return !thumbnail ? 'Vui lòng upload ảnh thumbnail' : undefined;
      case 'banner':
        return !banner ? 'Vui lòng upload ảnh banner' : undefined;
      case 'eventName':
        return asString(value).trim() === '' ? 'Vui lòng nhập tên sự kiện' : undefined;
      case 'venueName':
        return asString(value).trim() === '' ? 'Vui lòng nhập tên địa điểm' : undefined;
      case 'province':
        return asString(value) === '' ? 'Vui lòng chọn tỉnh/thành' : undefined;
      case 'district':
        return asString(value) === '' ? 'Vui lòng chọn quận/huyện' : undefined;
      case 'ward':
        return asString(value) === '' ? 'Vui lòng chọn phường/xã' : undefined;
      case 'street':
        return asString(value).trim() === '' ? 'Vui lòng nhập số nhà, đường' : undefined;
      case 'categoryId':
        {
          const n = asNumber(value);
          return Number.isNaN(n) || n === 0 ? 'Vui lòng chọn thể loại sự kiện' : undefined;
        }
      case 'description':
        return asString(value).trim() === '' ? 'Vui lòng nhập thông tin sự kiện' : undefined;
      case 'eventType':
        return asString(value) === '' ? 'Vui lòng chọn loại sự kiện' : undefined;
      case 'orgThumbnail':
        return !orgThumbnail ? 'Vui lòng upload logo ban tổ chức' : undefined;
      case 'orgName':
        return asString(value).trim() === '' ? 'Vui lòng nhập tên ban tổ chức' : undefined;
      case 'orgDescription':
        return asString(value).trim() === '' ? 'Vui lòng nhập thông tin ban tổ chức' : undefined;
      default:
        return undefined;
    }
  };

  // Handle field blur (mark as touched)
  const handleBlur = (fieldName: string) => {
    // Validate field on blur
    const error = validateField(fieldName, getFieldValue(fieldName));
    setLocalErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  // Get field value by name
  const getFieldValue = (fieldName: string): unknown => {
    switch (fieldName) {
      case 'thumbnail': return thumbnail;
      case 'banner': return banner;
      case 'eventName': return eventName;
      case 'venueName': return venueName;
      case 'province': return province;
      case 'district': return district;
      case 'ward': return ward;
      case 'street': return street;
      case 'categoryId': return categoryId;
      case 'description': return description;
      case 'eventType': return eventType;
      case 'orgThumbnail': return orgThumbnail;
      case 'orgName': return orgName;
      case 'orgDescription': return orgDescription;
      default: return '';
    }
  };

  // Handle field change with real-time validation
  const handleFieldChange = <T,>(fieldName: string, value: T, setter: SetState<T>) => {
    setter(value);
    
    // Clear error when user starts typing
    if (localErrors[fieldName as keyof ValidationErrors]) {
      setLocalErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
    
    // Real-time validation after a short delay
    setTimeout(() => {
      const error = validateField(fieldName, value);
      setLocalErrors(prev => ({ ...prev, [fieldName]: error }));
    }, 300);
  };

  // Khởi tạo hook địa chỉ Việt Nam, đẩy tên đã chọn ra form cha
  const {
    provinceList,
    districtList,
    wardList,
    selectedProvinceId,
    selectedDistrictId,
    onProvinceChange,
    onDistrictChange,
    onWardChange,
    getWardIdByName,
  } = useVietnamAddress({
    onProvinceNameChange: (name) => handleFieldChange('province', name, setProvince),
    onDistrictNameChange: (name) => handleFieldChange('district', name, setDistrict),
    onWardNameChange: (name) => handleFieldChange('ward', name, setWard),
    // Thêm props để prefill dữ liệu
    initialProvince: province,
    initialDistrict: district,
    initialWard: ward,
  });

  // Combine validation errors from props and local state
  const getCombinedErrors = (): ValidationErrors => {
    return { ...validationErrors, ...localErrors };
  };

  // Error message component
  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="mt-2 text-red-400 text-sm flex items-center">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    );
  };

  // Helper function to get border class
  const getBorderClass = (fieldName: string, defaultClass: string) => {
    const combinedErrors = getCombinedErrors();
    const hasError = combinedErrors[fieldName as keyof ValidationErrors];
    return hasError ? 'border-red-500' : defaultClass;
  };

  // Validate on mount and when dependencies change
  useEffect(() => {
    const combinedErrors = { ...validationErrors, ...localErrors } as ValidationErrors;
    const isValid = Object.values(combinedErrors).every(error => !error);
    onValidationChange?.(isValid);
  }, [validationErrors, localErrors, onValidationChange]);

  return (
    <div className="space-y-6 bg-gray-900 text-white p-6">
      {/* Upload Images Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Upload hình ảnh <span className="text-red-500">*</span>
          </h3>
          <a
            href="#"
            className="text-green-400 hover:text-green-300 text-sm"
          >
            Xem vị trí hiển thị các ảnh
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thumbnail */}
          <div>
            <ImageUpload
              imageType="thumbnail"
              value={thumbnail || null}
              onChange={(file) => handleFieldChange('thumbnail', file, setThumbnail || (() => {}))}
              label="Ảnh thumbnail sự kiện (720×958)"
            />
            <ErrorMessage error={localErrors.thumbnail} />
          </div>

          {/* Banner */}
          <div>
            <ImageUpload
              imageType="banner"
              value={banner || null}
              onChange={(file) => handleFieldChange('banner', file, setBanner || (() => {}))}
              label="Ảnh banner sự kiện (1280×720)"
            />
            <ErrorMessage error={localErrors.banner} />
          </div>
        </div>
      </div>

      {/* Event Name */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Tên sự kiện <span className="text-red-500">*</span>
        </h3>
        <div className="relative">
          <input
            type="text"
            value={eventName}
            onChange={(e) => handleFieldChange('eventName', e.target.value, setEventName)}
            onBlur={() => handleBlur('eventName')}
            placeholder="Tên sự kiện"
            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${getBorderClass('eventName', 'border-gray-600')}`}
          />
          <div className="absolute right-3 top-3 text-gray-400 text-sm">
            {(eventName || '').length}/100
          </div>
        </div>
        <ErrorMessage error={localErrors.eventName} />
      </div>

      {/* Event Address Type */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Địa chỉ sự kiện <span className="text-red-500">*</span>
        </h3>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="eventType"
              value="offline"
              checked={eventType === "offline"}
              onChange={(e) => handleFieldChange('eventType', e.target.value, setEventType)}
              onBlur={() => handleBlur('eventType')}
              className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
            />
            <span className="ml-3 text-gray-300">Sự kiện Offline</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="eventType"
              value="online"
              checked={eventType === "online"}
              onChange={(e) => handleFieldChange('eventType', e.target.value, setEventType)}
              onBlur={() => handleBlur('eventType')}
              className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 focus:ring-green-500"
            />
            <span className="ml-3 text-gray-300">Sự kiện Online</span>
          </label>
        </div>
        <ErrorMessage error={localErrors.eventType} />
      </div>

      {/* Venue Name */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Tên địa điểm <span className="text-red-500">*</span>
        </h3>
        <div className="relative">
          <input
            type="text"
            value={venueName}
            onChange={(e) => handleFieldChange('venueName', e.target.value, setVenueName)}
            onBlur={() => handleBlur('venueName')}
            placeholder="Tên địa điểm"
            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${getBorderClass('venueName', 'border-gray-600')}`}
          />
          <div className="absolute right-3 top-3 text-gray-400 text-sm">
            {(venueName || '').length}/80
          </div>
        </div>
        <ErrorMessage error={localErrors.venueName} />
      </div>

      {/* Location Details */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Province */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tỉnh/Thành <span className="text-red-500">*</span>
            </label>
            <div className="relative">
            <select
                value={selectedProvinceId}
                onChange={(e) => onProvinceChange(e.target.value)}
                onBlur={() => handleBlur('province')}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none ${getBorderClass('province', 'border-gray-600')}`}
              >
                <option value="">Chọn tỉnh/thành</option>
                {provinceList.map((prov) => (
                  <option key={prov.province_id} value={prov.province_id}>
                    {prov.province_name}
                  </option>
                ))}
              </select> 
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <ErrorMessage error={localErrors.province} />
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                  value={selectedDistrictId}
                  onChange={(e) => onDistrictChange(e.target.value)}
                  onBlur={() => handleBlur('district')}
                  disabled={!selectedProvinceId}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none ${getBorderClass('district', 'border-gray-600')}`}
                >
                  <option value="">Chọn quận/huyện</option>
                  {districtList.map((dist) => (
                    <option key={dist.district_id} value={dist.district_id}>
                      {dist.district_name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <ErrorMessage error={localErrors.district} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ward */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <select
                  value={getWardIdByName(ward)}
                  onChange={(e) => onWardChange(e.target.value)}
                  onBlur={() => handleBlur('ward')}
                  disabled={!selectedDistrictId}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none ${getBorderClass('ward', 'border-gray-600')}`}
                >
                  <option value="">Chọn phường/xã</option>
                  {wardList.map((w) => (
                    <option key={w.ward_id} value={w.ward_id}>
                      {w.ward_name}
                  </option>
                  ))}
                </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <ErrorMessage error={localErrors.ward} />
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Số nhà, đường <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={street}
                onChange={(e) => handleFieldChange('street', e.target.value, setStreet)}
                onBlur={() => handleBlur('street')}
                placeholder="Số nhà, đường"
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${getBorderClass('street', 'border-gray-600')}`}
              />
              <div className="absolute right-3 top-3 text-gray-400 text-sm">
                {(street || '').length}/80
              </div>
            </div>
            <ErrorMessage error={localErrors.street} />
          </div>
        </div>
      </div>

      {/* Event Category */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Thể loại sự kiện <span className="text-red-500">*</span>
        </h3>
        <div className="relative">
          <select
            value={categoryId}
            onChange={(e) => handleFieldChange('categoryId', parseInt(e.target.value), setCategoryId)}
            onBlur={() => handleBlur('categoryId')}
            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none ${getBorderClass('categoryId', 'border-gray-600')}`}
          >
            <option value="">Chọn thể loại</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        <ErrorMessage error={localErrors.categoryId} />
      </div>

      {/* Event Information */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Thông tin sự kiện <span className="text-red-500">*</span>
        </h3>
        <div className={`border rounded-lg bg-white ${getBorderClass('description', 'border-gray-600')}`}>
          <RichTextEditor
            value={description}
            onChange={(value) => handleFieldChange('description', value, setDescription)}
            placeholder="Tóm tắt, chi tiết chương trình, khách mời, trải nghiệm đặc biệt, điều khoản…"
          />
        </div>
        <ErrorMessage error={localErrors.description} />
      </div>

      {/* Organization Info */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-start gap-6">
          {/* Organization Logo */}
          <div className="w-[275px] flex-shrink-0">
            <ImageUpload
              imageType="org_thumbnail"
              value={orgThumbnail || null}
              onChange={(file) => handleFieldChange('orgThumbnail', file, setOrgThumbnail || (() => {}))}
              label="Logo ban tổ chức (275×275)"
            />
            <ErrorMessage error={localErrors.orgThumbnail} />
          </div>
          
          {/* Organization Details */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tên ban tổ chức <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => handleFieldChange('orgName', e.target.value, setOrgName)}
                  onBlur={() => handleBlur('orgName')}
                  placeholder="Tên ban tổ chức"
                  maxLength={80}
                  className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${getBorderClass('orgName', 'border-gray-300')}`}
                />
                <div className="absolute right-3 top-3 text-gray-400 text-sm">
                  {(orgName || '').length}/80
                </div>
              </div>
              <ErrorMessage error={localErrors.orgName} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thông tin ban tổ chức <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={orgDescription}
                  onChange={(e) => handleFieldChange('orgDescription', e.target.value, setOrgDescription)}
                  onBlur={() => handleBlur('orgDescription')}
                  placeholder="Thông tin ban tổ chức"
                  maxLength={500}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${getBorderClass('orgDescription', 'border-gray-300')}`}
                />
                <div className="absolute right-3 bottom-3 text-gray-400 text-sm">
                  {(orgDescription || '').length}/500
                </div>
              </div>
              <ErrorMessage error={localErrors.orgDescription} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

