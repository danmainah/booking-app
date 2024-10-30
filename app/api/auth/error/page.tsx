'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className='flex h-screen items-center justify-center'>
      <h1 className='text-2xl font-bold'>Error: {error}</h1>
    </div>
  );
}