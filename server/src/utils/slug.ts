import slugify from 'slugify';

export function createSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = createSlug(base);
  let counter = 1;
  while (await exists(slug)) {
    slug = `${createSlug(base)}-${counter++}`;
  }
  return slug;
}
