import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { badRequest } from './errors';
import { sanitizeSvg } from './sanitize';

const MAX_DIMENSION = 1920;
const ICON_MAX_DIMENSION = 256;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;

export async function processUploadedImage(
  filePath: string,
  mimetype: string,
  options?: { isIcon?: boolean }
): Promise<{ filename: string; outputPath: string }> {
  const dir = path.dirname(filePath);
  const isIcon = options?.isIcon ?? false;

  if (mimetype === 'image/svg+xml') {
    const raw = await fs.readFile(filePath, 'utf8');
    const sanitized = sanitizeSvg(raw);
    const filename = path.basename(filePath);
    await fs.writeFile(filePath, sanitized, 'utf8');
    return { filename, outputPath: filePath };
  }

  if (mimetype === 'image/gif') {
    const filename = path.basename(filePath);
    return { filename, outputPath: filePath };
  }

  const maxDim = isIcon ? ICON_MAX_DIMENSION : MAX_DIMENSION;
  const base = path.basename(filePath, path.extname(filePath));
  const outputFilename = `${base}.webp`;
  const outputPath = path.join(dir, outputFilename);

  try {
    const image = sharp(filePath, { failOn: 'error' });
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) {
      throw badRequest('Invalid image file');
    }

    await image
      .rotate()
      .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    if (outputPath !== filePath) {
      await fs.unlink(filePath).catch(() => undefined);
    }

    return { filename: outputFilename, outputPath };
  } catch {
    const ext = path.extname(filePath).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      try {
        const image = sharp(filePath, { failOn: 'error' });
        await image
          .rotate()
          .resize(maxDim, maxDim, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
          .toFile(outputPath.replace('.webp', '.jpg'));

        const jpgPath = outputPath.replace('.webp', '.jpg');
        await fs.unlink(filePath).catch(() => undefined);
        return { filename: path.basename(jpgPath), outputPath: jpgPath };
      } catch {
        throw badRequest('Invalid or corrupted image file');
      }
    }
    throw badRequest('Invalid or corrupted image file');
  }
}
