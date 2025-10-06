export interface ImageDimension {
  width: number;
  height: number;
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export const IMAGE_REQUIREMENTS = {
  thumbnail: { width: 720, height: 958, maxSize: 2 * 1024 * 1024 }, // 2MB
  banner: { width: 1280, height: 720, maxSize: 5 * 1024 * 1024 }, // 5MB
  org_thumbnail: { width: 275, height: 275, maxSize: 2 * 1024 * 1024 }, // 2MB
} as const;

export type ImageType = keyof typeof IMAGE_REQUIREMENTS;

/**
 * Validate image file size
 */
export const validateFileSize = (file: File, maxSize: number): ImageValidationResult => {
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Kích thước file không được vượt quá ${formatFileSize(maxSize)}`
    };
  }
  return { isValid: true };
};

/**
 * Validate image file type
 */
export const validateFileType = (file: File): ImageValidationResult => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP'
    };
  }
  return { isValid: true };
};

/**
 * Get image dimensions from file
 */
export const getImageDimensions = (file: File): Promise<ImageDimension> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không thể đọc thông tin ảnh'));
    };
    
    img.src = objectUrl;
  });
};

/**
 * Validate image dimensions
 */
export const validateImageDimensions = (
  actualDimensions: ImageDimension,
  requiredDimensions: ImageDimension,
  tolerance: number = 0
): ImageValidationResult => {
  const { width: actualWidth, height: actualHeight } = actualDimensions;
  const { width: requiredWidth, height: requiredHeight } = requiredDimensions;
  
  const widthDiff = Math.abs(actualWidth - requiredWidth);
  const heightDiff = Math.abs(actualHeight - requiredHeight);
  
  if (widthDiff > tolerance || heightDiff > tolerance) {
    return {
      isValid: false,
      error: `Kích thước ảnh phải là ${requiredWidth}×${requiredHeight}px. Ảnh hiện tại: ${actualWidth}×${actualHeight}px`
    };
  }
  
  return { isValid: true };
};

/**
 * Comprehensive image validation
 */
export const validateImage = async (
  file: File,
  imageType: ImageType
): Promise<ImageValidationResult> => {
  const requirements = IMAGE_REQUIREMENTS[imageType];
  
  // Validate file type
  const typeValidation = validateFileType(file);
  if (!typeValidation.isValid) {
    return typeValidation;
  }
  
  // Validate file size
  const sizeValidation = validateFileSize(file, requirements.maxSize);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }
  
  try {
    // Validate dimensions
    const dimensions = await getImageDimensions(file);
    const dimensionValidation = validateImageDimensions(
      dimensions,
      { width: requirements.width, height: requirements.height },
      10 // Allow 10px tolerance
    );
    
    if (!dimensionValidation.isValid) {
      return dimensionValidation;
    }
    
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Không thể xử lý file ảnh'
    };
  }
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Create preview URL from file
 */
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke preview URL to free memory
 */
export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};
