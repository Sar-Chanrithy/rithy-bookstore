import { redirect } from 'next/navigation';

export default async function BooksPage({ searchParams }) {
  const resolved = await searchParams;
  const query = new URLSearchParams(resolved || {}).toString();
  redirect(`/${query ? `?${query}` : ''}`);
}
