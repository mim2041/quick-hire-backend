import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';

const uploadStorage = multer.memoryStorage();

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream',
];

const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm', '.mov'];

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  const fileNameLower = file.originalname.toLowerCase();
  const hasAllowedExtension = allowedExtensions.some((ext) => fileNameLower.endsWith(ext));

  if (!allowedMimeTypes.includes(file.mimetype) && !hasAllowedExtension) {
    callback(
      new AppError(
        httpStatus.BAD_REQUEST,
        'Unsupported file type. Allowed: pdf, doc, docx, image, video.'
      )
    );
    return;
  }

  callback(null, true);
};

export const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
});
