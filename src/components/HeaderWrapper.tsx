'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import BookingDialog from './home/BookingDialog';

export default function HeaderWrapper() {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isHomePage = pathname === '/';

  return (
    <>
      <Header onBookingClick={() => setShowBookingDialog(true)} />
      {!isHomePage && <div className="h-[72px]" />}
      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
      />
    </>
  );
}
