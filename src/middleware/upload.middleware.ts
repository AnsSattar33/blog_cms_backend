import multer from "multer";
import { ALLOWED_IMAGE_TYPES } from "../constants/cloudinary";
import { MESSAGES } from "../constants/messages";
import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest(MESSAGES.UPLOAD.INVALID_TYPE));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter,
});

export const uploadCoverImage = upload.single("coverImage");

export const optionalUploadCoverImage = upload.single("coverImage");
