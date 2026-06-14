import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./admin.module.css";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // Redirect non-admin/editor members back to home
  if (session.user && (session.user as any).role === "Member") {
    redirect("/");
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>VetAdmin</h2>
          <Link href="/" className={styles.webBtn}>
            <i className="fa-solid fa-globe"></i> Web
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>Dashboard</Link>
          <Link href="/admin/services" className={styles.navLink}>Hizmetlerimiz</Link>
          <Link href="/admin/veterinarians" className={styles.navLink}>Ekibimiz</Link>
          <Link href="/admin/gallery" className={styles.navLink}>Galeri</Link>
          <Link href="/admin/testimonials" className={styles.navLink}>Yorumlar</Link>
          <Link href="/admin/blog" className={styles.navLink}>Blog</Link>
          <Link href="/admin/pages" className={styles.navLink}>İletişim</Link>
          <Link href="/admin/users" className={styles.navLink}>Yöneticiler</Link>
          <Link href="/admin/settings" className={styles.navLink}>Ayarlar</Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.userInfo}>
            Hoş geldiniz, {session.user?.name || session.user?.email}
          </div>
          <AdminLayoutClient />
        </header>
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
