import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';
import { AppError } from './error-handler.js';

export type UploadFolder = 'projects' | 'avatars';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const BASE_UPLOAD_PATH = path.join(process.cwd(), 'public', 'imgs');

function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateFileName(fieldname: string, originalName: string): string {
  const ext = path.extname(originalName);
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${fieldname}-${uniqueSuffix}${ext}`;
}

function createDiskStorage(folder: UploadFolder) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadPath = path.join(BASE_UPLOAD_PATH, folder);
      ensureDirectoryExists(uploadPath);
      cb(null, uploadPath);
    },

    filename: (_req, file, cb) => {
      cb(null, generateFileName(file.fieldname, file.originalname));
    },
  });
}

function imageFileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only jpeg, png and webp images are allowed.', 403));
  }
}

interface UploadOptions {
  folder: UploadFolder;
  maxFileSizeMB?: number;
}

export function createUploader({ folder, maxFileSizeMB = 5 }: UploadOptions) {
  return multer({
    storage: createDiskStorage(folder),
    fileFilter: imageFileFilter,
    limits: {
      fileSize: maxFileSizeMB * 1024 * 1024,
    },
  });
}
