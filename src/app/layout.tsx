import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vet Clinic CMS",
  description: "Modern veterinary care",
};

import { prisma } from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  const services = await prisma.service.findMany({
    where: { active: true },
    select: { id: true, title: true },
    orderBy: { createdAt: "asc" },
  });

  const settings = await prisma.settings.findFirst();

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className={inter.className}>
        <Providers>
          <NavbarWrapper session={session} services={services} settings={settings} />
          {children}
          <FooterWrapper settings={settings} />
          <WhatsAppFloat settings={settings} />
        </Providers>
      </body>
    </html>
  );
}

