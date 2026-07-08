import path from 'path';

const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const ALLOWED_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

export function sanitizeFilename(original: string): string {
  const ext = path.extname(original).toLowerCase();
  const safeExt = ALLOWED_IMAGE_EXTENSIONS.has(ext) ? ext : '.jpg';
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${unique}${safeExt}`;
}

export function isAllowedMime(mimetype: string): boolean {
  return ALLOWED_IMAGE_MIMES.has(mimetype);
}

export function sanitizeSvg(content: string): string {
  return content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
}

export function sanitizeText(value: string, maxLength = 500): string {
  return value.trim().slice(0, maxLength);
}

const EXT_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export function getMimeFromExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return EXT_TO_MIME[ext] || 'application/octet-stream';
}

/** Resolve a user-supplied filename to a path inside uploadDir, or null if unsafe. */
export function resolveSafeUploadPath(uploadDir: string, filename: string): string | null {
  const base = path.basename(filename);
  if (!base || base !== filename || base.includes('..')) return null;

  const ext = path.extname(base).toLowerCase();
  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) return null;

  const uploadRoot = path.resolve(uploadDir);
  const resolved = path.resolve(uploadRoot, base);
  const relative = path.relative(uploadRoot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;

  return resolved;
}
