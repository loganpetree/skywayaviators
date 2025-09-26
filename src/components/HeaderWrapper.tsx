'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import BookingDialog from './home/BookingDialog';

export default function HeaderWrapper() {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const pathname = usePathname();

  // Hide header on admin routes
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <Header onBookingClick={() => setShowBookingDialog(true)} />
      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
      />
    </>
  );
}
