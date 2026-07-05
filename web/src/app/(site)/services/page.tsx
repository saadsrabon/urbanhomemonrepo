import { ServicesPageContent } from '@/components/site/ServicesPageContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getData() {
  const [services, testimonials, locations] = await Promise.all([
    fetch(`${API_URL}/services`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/testimonials`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/locations`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
  ]);
  return { services, testimonials, locations };
}

export default async function ServicesPage() {
  const data = await getData();
  return <ServicesPageContent {...data} />;
}
