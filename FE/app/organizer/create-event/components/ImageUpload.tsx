import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { validateImage, createPreviewUrl, revokePreviewUrl, IMAGE_REQUIREMENTS, type ImageType } from '@/src/utils/image.utils';

interface ImageUploadProps {
  imageType: ImageType;
  value?: File | null;
  onChange: (file: File | null) => void;
  label: string;
  className?: string;
}

export default function ImageUploadProps({ 
  imageType, 
  value, 
  onChange, 
  label, 
  className = '' 
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const requirements = IMAGE_REQUIREMENTS[imageType];

  // Create preview when value changes
  React.useEffect(() => {
    if (value) {
      const url = createPreviewUrl(value);
      setPreviewUrl(url);
      return () => revokePreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsValidating(true);
    setValidationError(null);

    try {
      const validation = await validateImage(file, imageType);
      
      if (validation.isValid) {
        onChange(file);
      } else {
        setValidationError(validation.error || 'File không hợp lệ');
        onChange(null);
      }
    } catch (error) {
      setValidationError('Có lỗi xảy ra khi xử lý file');
      onChange(null);
    } finally {
      setIsValidating(false);
    }
  }, [imageType, onChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleRemove = useCallback(() => {
    onChange(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-gray-300 text-sm font-medium">
        {label}
      </label>
      
      {/* Requirements info */}
      <p className="text-gray-400 text-xs">
        Kích thước: {requirements.width}×{requirements.height}px, 
        Tối đa: {Math.round(requirements.maxSize / (1024 * 1024))}MB
      </p>

      <div className="relative">
        {/* Upload area */}
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            border-2 border-dashed rounded-lg transition-colors cursor-pointer
            ${validationError ? 'border-red-500 bg-red-500/10' : 'border-gray-600 hover:border-green-500'}
            ${isValidating ? 'opacity-50 pointer-events-none' : ''}
            ${previewUrl ? 'p-2' : 'p-8'}
          `}
        >
          {previewUrl ? (
            // Preview with image
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-auto rounded-md"
                style={{ 
                  maxHeight: '200px',
                  objectFit: 'contain'
                }}
              />
              
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <p className="text-white text-sm">Click để thay đổi</p>
              </div>
            </div>
          ) : (
            // Empty state
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg mb-4 flex items-center justify-center mx-auto">
                {isValidating ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <Upload className="w-6 h-6 text-white" />
                )}
              </div>
              <p className="text-gray-300 text-sm mb-1">
                {isValidating ? 'Đang xử lý...' : 'Thêm ảnh'}
              </p>
              <p className="text-gray-400 text-xs">
                Kéo thả hoặc click để chọn file
              </p>
            </div>
          )}
        </div>

        {/* Error message */}
        {validationError && (
          <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
