import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer({ settings }: { settings?: any }) {
  const clinicName = settings?.clinic_name || "VetCare";

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* Hakkımızda / Logo */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerLogo}>{clinicName}</h3>
        </div>

        {/* Biz Kimiz */}
        <div className={styles.footerSection}>
          <h4>Biz Kimiz</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/about">Hakkımızda</Link></li>
            <li><Link href="/about/mission">Misyonumuz</Link></li>
            <li><Link href="/about/vision">Vizyonumuz</Link></li>
            <li><Link href="/team">Ekibimiz</Link></li>
          </ul>
        </div>

        {/* Hızlı Bağlantılar */}
        <div className={styles.footerSection}>
          <h4>Hızlı Bağlantılar</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/">Ana Sayfa</Link></li>
            <li><Link href="/services">Hizmetlerimiz</Link></li>
            <li><Link href="/gallery">Galeri</Link></li>
            <li><Link href="/contact">İletişim</Link></li>
          </ul>
        </div>

        {/* İletişim */}
        <div className={styles.footerSection}>
          <h4>İletişim</h4>
          <ul className={styles.footerContact}>
            {settings?.address && (
              <li><i className="fa-solid fa-location-dot"></i> {settings.address}</li>
            )}
            {settings?.phone && (
              <li><i className="fa-solid fa-phone"></i> {settings.phone}</li>
            )}
            {settings?.email && (
              <li><i className="fa-solid fa-envelope"></i> {settings.email}</li>
            )}
            {!settings?.address && !settings?.phone && !settings?.email && (
               <li>İletişim bilgisi bulunamadı.</li>
            )}
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <p>&copy; {new Date().getFullYear()} {clinicName}. Tüm hakları saklıdır.</p>
          <div className={styles.footerBottomLinks}>
            <Link href="#">Gizlilik Politikası</Link>
            <Link href="#">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
