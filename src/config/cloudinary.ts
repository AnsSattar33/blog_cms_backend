import { v2 as cloudinary } from "cloudinary";
import { env, isCloudinaryConfigured } from "./env";

export const configureCloudinary = (): void => {
  if (!isCloudinaryConfigured()) {
    console.warn("Cloudinary is not configured. Image uploads will fail until credentials are set.");
    return;
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

export { cloudinary };
