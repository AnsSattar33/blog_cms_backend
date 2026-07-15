import { UploadApiResponse } from "cloudinary";
import { cloudinary, isCloudinaryConfigured } from "../config";
import { CLOUDINARY_FOLDER } from "../constants/cloudinary";
import { MESSAGES } from "../constants/messages";
import { ApiError } from "../utils/api-error";
import { CloudinaryUploadResult } from "../types";

export const cloudinaryService = {
  async uploadImage(
    buffer: Buffer,
    folder: string = CLOUDINARY_FOLDER
  ): Promise<CloudinaryUploadResult> {
    if (!isCloudinaryConfigured()) {
      throw ApiError.badRequest(MESSAGES.UPLOAD.CLOUDINARY_NOT_CONFIGURED);
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            reject(ApiError.badRequest(MESSAGES.UPLOAD.UPLOAD_FAILED, [error?.message ?? "Unknown error"]));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  },

  async deleteImage(publicId: string): Promise<void> {
    if (!isCloudinaryConfigured() || !publicId) return;

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch {
      // Non-blocking: log but don't fail the main operation
      console.warn(`Failed to delete Cloudinary image: ${publicId}`);
    }
  },

  async replaceImage(
    oldPublicId: string | undefined,
    buffer: Buffer,
    folder?: string
  ): Promise<CloudinaryUploadResult> {
    const uploaded = await this.uploadImage(buffer, folder);
    if (oldPublicId) {
      await this.deleteImage(oldPublicId);
    }
    return uploaded;
  },
};
