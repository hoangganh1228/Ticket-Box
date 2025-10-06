/**
 * Convert image URL thành File object để hiển thị preview
 */

export const urlToFile = async (url: string, filename: string): Promise<File | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error converting URL to File:', error);
    return null;
  }
};

/**
 * Load image URLs từ server và convert thành File objects
 */
export const loadImageFilesFromUrls = async (imageUrls: {
  thumbnail?: string | null;
  banner?: string | null;
  org_thumbnail?: string | null;
}): Promise<{
  thumbnail: File | null;
  banner: File | null;
  orgThumbnail: File | null;
}> => {
  const [thumbnailFile, bannerFile, orgThumbnailFile] = await Promise.all([
    imageUrls.thumbnail ? urlToFile(imageUrls.thumbnail, 'thumbnail.jpg') : Promise.resolve(null),
    imageUrls.banner ? urlToFile(imageUrls.banner, 'banner.jpg') : Promise.resolve(null),
    imageUrls.org_thumbnail ? urlToFile(imageUrls.org_thumbnail, 'org_thumbnail.jpg') : Promise.resolve(null),
  ]);

  return {
    thumbnail: thumbnailFile,
    banner: bannerFile,
    orgThumbnail: orgThumbnailFile,
  };
};
