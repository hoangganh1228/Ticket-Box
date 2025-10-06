/**
 * Generate a unique slug from a string
 * @param text - The text to convert to slug
 * @param checkExistsFn - Function to check if slug already exists
 * @param options - Slug generation options
 * @returns Promise<string> - Unique slug
 */
export async function generateUniqueSlug(
  text: string,
  checkExistsFn: (slug: string) => Promise<boolean>,
  options: {
    lower?: boolean;
    strict?: boolean;
    separator?: string;
    maxAttempts?: number;
  } = {}
): Promise<string> {
  const {
    lower = true,
    strict = true,
    separator = '-',
    maxAttempts = 100
  } = options;

  // Basic slug generation
  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, separator) // Replace spaces and underscores with separator
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing separators

  if (strict) {
    slug = slug.replace(/[^a-z0-9-]/g, ''); // Only allow letters, numbers, and hyphens
  }

  // Check if slug exists and generate unique version
  let counter = 1;
  let originalSlug = slug;
  let attempts = 0;

  while (await checkExistsFn(slug) && attempts < maxAttempts) {
    slug = `${originalSlug}${separator}${counter}`;
    counter++;
    attempts++;
  }

  if (attempts >= maxAttempts) {
    // Fallback: add timestamp to ensure uniqueness
    const timestamp = Date.now();
    slug = `${originalSlug}${separator}${timestamp}`;
  }

  return slug;
}

export function generateSlug(
  text: string,
  options: {
    lower?: boolean;
    strict?: boolean;
    separator?: string;
  } = {}
): string {
  const {
    lower = true,
    strict = true,
    separator = '-'
  } = options;

  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, separator)
    .replace(/^-+|-+$/g, '');

  if (strict) {
    slug = slug.replace(/[^a-z0-9-]/g, '');
  }

  return slug;
}
