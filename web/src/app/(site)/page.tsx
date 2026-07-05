import { HomePageContent } from '@/components/site/HomePageContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getData() {
  const [services, testimonials, team, settings, pricing, faqs] = await Promise.all([
    fetch(`${API_URL}/services`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/testimonials`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/team`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/settings`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => ({})),
    fetch(`${API_URL}/pricing`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/faqs`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
  ]);
  return { services, testimonials, team, settings, pricing, faqs };
}

export default async function HomePage() {
  const data = await getData();
  return <HomePageContent {...data} />;
}
