import { v2 as cloudinary } from "cloudinary";

// Cloudinary SDK automatically reads CLOUDINARY_URL if set
// Format: cloudinary://api_key:api_secret@cloud_name
// If CLOUDINARY_URL is not set, fallback to individual env vars
if (process.env.CLOUDINARY_URL) {
  // SDK will automatically parse CLOUDINARY_URL
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  // Fallback to individual env vars if CLOUDINARY_URL is not set
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export { cloudinary };

export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }
): string {
  const transformations: string[] = [];
  
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);

  const transformString = transformations.length > 0 
    ? transformations.join(",") + "/"
    : "";

  // Extract cloud_name from CLOUDINARY_URL if available, otherwise use env var
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName && process.env.CLOUDINARY_URL) {
    // Parse cloud_name from CLOUDINARY_URL: cloudinary://api_key:api_secret@cloud_name
    const match = process.env.CLOUDINARY_URL.match(/@([^@]+)$/);
    if (match) {
      cloudName = match[1];
    }
  }
  
  if (!cloudName) {
    throw new Error("Cloudinary cloud_name is not configured");
  }
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`;
}
