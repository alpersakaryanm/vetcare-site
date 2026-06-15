"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper({ session, services, settings }: { session: any, services: any[], settings: any }) {
  const pathname = usePathname();

  // Do not render navbar on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Navbar session={session} services={services} settings={settings} />;
}
