import { AboutPageContent } from '@/components/site/AboutPageContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getData() {
  const [team, settings] = await Promise.all([
    fetch(`${API_URL}/team`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => []),
    fetch(`${API_URL}/settings`, { next: { revalidate: 60 } }).then((r) => r.json()).catch(() => ({})),
  ]);
  return { team, settings };
}

export default async function AboutPage() {
  const { team, settings } = await getData();
  return <AboutPageContent team={team} settings={settings} />;
}
