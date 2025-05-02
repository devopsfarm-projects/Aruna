'use client';
import { usePathname } from 'next/navigation';
import Navbar from '../navbar/page';
import NavbarTop from '../navbar/navbartop';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const shouldShowNavbar = !['/', '/login'].includes(pathname);

  return shouldShowNavbar ? (
    <>
      <NavbarTop />
      <Navbar />
    </>
  ) : null;
}