'use client';

import { Button } from '@/material-tailwind';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button color="blue" onClick={() => router.back()}>
      Back
    </Button>
  );
}
