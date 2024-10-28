'use client';

import { useSearchParams } from 'next/navigation';

export default function Error() {
  const search = useSearchParams();
  const error = search.get('error');

  return (
    <div>
      <h1>Error: {error}</h1>
    </div>
  );
};
