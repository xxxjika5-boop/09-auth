'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <>{children}</>;
}