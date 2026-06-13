import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import styles from "../about.module.css";

export const dynamic = "force-dynamic";

export default async function VisionPage() {
  const settings = await prisma.settings.findFirst();
  const defaultVision = "Bölgenin en güvenilir ve tam donanımlı hayvan hastanesi olarak, patili dostlarımızın refahını en üst seviyeye taşımak.";
  const vision = settings?.about_vision || defaultVision;
  const image = settings?.about_image || "/uploads/vet-clinic-interior.png"; 

  return (
    <main className={styles.main}>
      <section className={styles.heroGradient}>
        <div className="container">
          <h1 className={styles.heroTitle}>Vizyonumuz</h1>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutTextContent}>
              <div className={styles.sectionBadge}>
                <i className="fa-solid fa-eye"></i> Hakkımızda <span>—</span>
              </div>
              <h2>Geleceğe Dair<br/><span>Hedeflerimiz</span></h2>
              <div className={styles.separator}></div>

              <div className={styles.aboutImageContent}>
                <div className={styles.blueShape}></div>
                <div className={styles.aboutImageWrapper}>
                  <Image src={image} alt="Vizyonumuz" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={`${styles.floatingPill} ${styles.pill1}`}>
                  <i className="fa-solid fa-star" style={{color: '#0ea5e9'}}></i> Tam Donanımlı
                </div>
                <div className={`${styles.floatingPill} ${styles.pill2}`}>
                  <i className="fa-solid fa-arrow-trend-up" style={{color: '#0ea5e9'}}></i> En Üst Seviye
                </div>
                <div className={`${styles.floatingPill} ${styles.pill3}`}>
                  <i className="fa-solid fa-medal" style={{color: '#0ea5e9'}}></i> Güvenilir
                </div>
              </div>

              <div className={styles.textContent}>
                {vision.split('\n').map((line, i) => (
                  <p key={i} className={styles.boldDesc}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.bottomNav}>
            <Link href="/about" className={styles.navLinkBtn}>
              <div className={styles.iconWrap}><i className="fa-solid fa-building"></i></div>
              <div className={styles.cardText}>
                <h3>Hakkımızda</h3>
                <p>Kliniğimizin Hikayesi</p>
              </div>
              <div className={styles.clickIcon}><i className="fa-solid fa-arrow-pointer"></i></div>
            </Link>
            <Link href="/about/mission" className={styles.navLinkBtn}>
              <div className={styles.iconWrap}><i className="fa-solid fa-bullseye"></i></div>
              <div className={styles.cardText}>
                <h3>Misyonumuz</h3>
                <p>Değerlerimizi inceleyin</p>
              </div>
              <div className={styles.clickIcon}><i className="fa-solid fa-arrow-pointer"></i></div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
