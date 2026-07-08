import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import { badRequest } from '../utils/errors';
import { isAllowedMime, sanitizeFilename } from '../utils/sanitize';

const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    cb(null, sanitizeFilename(file.originalname));
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (isAllowedMime(file.mimetype)) cb(null, true);
  else cb(badRequest('Only image files are allowed (JPEG, PNG, WebP, GIF, SVG)') as unknown as null, false);
};

export const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter,
});

export function getPublicUrl(filename: string): string {
  return `/uploads/${filename}`;
}
