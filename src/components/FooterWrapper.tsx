"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper({ settings }: { settings?: any }) {
  const pathname = usePathname();

  // Do not render footer on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer settings={settings} />;
}
