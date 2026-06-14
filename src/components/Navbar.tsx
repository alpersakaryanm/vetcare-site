"use client";

import Link from "next/link";
import styles from "./navbar.module.css";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type SubItem = { href: string; label: string; sub: string };
type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
  matchPaths?: string[];
  subItems?: SubItem[];
  isLogout?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Ana Sayfa",
    exact: true,
  },
  {
    href: "/services",
    label: "Hizmetlerimiz",
  },
  {
    href: "/biz-kimiz",
    label: "Biz Kimiz",
    matchPaths: ["/biz-kimiz", "/about", "/team"],
    subItems: [
      { href: "/about", label: "Hakkımızda", sub: "Kliniğimizi tanıyın" },
      { href: "/about/mission", label: "Misyonumuz", sub: "Amacımız ve hedeflerimiz" },
      { href: "/about/vision", label: "Vizyonumuz", sub: "Gelecek planlarımız" },
      { href: "/team", label: "Ekibimiz", sub: "Uzman kadromuz" },
    ],
  },
  {
    href: "/gallery",
    label: "Galeri",
  },
  {
    href: "/blog",
    label: "Blog",
    matchPaths: ["/blog"],
  },
  {
    href: "/contact",
    label: "İletişim",
  },
];

function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.exact) return pathname === item.href;
  if (item.matchPaths) return item.matchPaths.some((p) => pathname.startsWith(p));
  return pathname.startsWith(item.href);
}

export default function Navbar({ session, services = [] }: { session: any, services?: any[] }) {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Navbar yüksekliğini ayarlıyoruz
  useEffect(() => {
    document.documentElement.style.setProperty("--navbar-height", "80px");
  }, []);

  // Sayfa kaydırmayı (scroll) dinliyoruz
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdminUser = session?.user && (session.user as any).role !== "Member";

  // Dinamik olarak auth ve admin sekmelerini ekleyelim
  // NAV_ITEMS'ı kopyalayalım (deep copy) çünkü içine dinamik alt menüler ekleyeceğiz
  const items = JSON.parse(JSON.stringify(NAV_ITEMS)) as NavItem[];
  
  // Hizmetler alt menüsünü dinamik olarak dolduralım
  const servicesItem = items.find(i => i.href === "/services");
  if (servicesItem && services.length > 0) {
    servicesItem.matchPaths = ["/services"];
    servicesItem.subItems = services.map(s => ({
      href: `/services/${s.id}`,
      label: s.title,
      sub: "Detayları inceleyin"
    }));
  }

  if (isAdminUser) {
    items.push({ href: "/admin", label: "Panel" });
  }
  if (session) {
    items.push({ href: "#logout", label: "Çıkış", isLogout: true });
  } else {
    items.push({ href: "/admin/login", label: "Giriş Yap" });
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sayfa değiştiğinde mobil menüyü kapat
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.navContainer} ${isScrolled ? styles.navScrolled : ""}`}>
        
        {/* Mobil Hamburger Butonu */}
        <button 
          className={styles.hamburgerBtn} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Masaüstü Menü ve Mobil Menü İçeriği */}
        <div className={`${styles.navItems} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}>
          {items.map((item, idx) => {
            const active = item.isLogout ? false : isItemActive(item, pathname);
            const hasDropdown = item.subItems && item.subItems.length > 0;
            const isHovered = hoveredTab === item.href;

            return (
              <div
                key={item.href}
                className={`${styles.tabWrapper} ${active ? styles.tabActiveWrapper : ""}`}
                onMouseEnter={() => setHoveredTab(item.href)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                {item.isLogout ? (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`${styles.tab} ${styles.tabLogout}`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`${styles.tab} ${active ? styles.tabActive : ""}`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Düşen Menü (Dropdown) */}
                {hasDropdown && isHovered && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownArrow} />
                    <div className={styles.dropdownContent}>
                      {item.subItems!.map((sub, i) => (
                        <Link key={sub.href} href={sub.href} className={styles.dropdownItem}>
                          <div className={styles.dropdownTitle}>{sub.label}</div>
                          <div className={styles.dropdownSub}>{sub.sub}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
