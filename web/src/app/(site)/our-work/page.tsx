import { OurWorkPageContent } from '@/components/site/OurWorkPageContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const metadata = {
  title: 'Our Work | Urban Home & Security',
  description:
    'Explore our portfolio of completed remodeling, security, roofing, and renovation projects across Houston, TX.',
};

async function getData() {
  const [projects, testimonials, settings] = await Promise.all([
    fetch(`${API_URL}/projects`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/testimonials`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/settings`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => ({})),
  ]);
  return { projects, testimonials, settings };
}

export default async function OurWorkPage() {
  const { projects, testimonials, settings } = await getData();

  return (
    <OurWorkPageContent
      projects={projects}
      testimonials={testimonials}
      contactPhone={(settings.contactPhone as string) || '(346) 365-7221'}
    />
  );
}
