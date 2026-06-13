import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import styles from "../about.module.css";

export const dynamic = "force-dynamic";

export default async function MissionPage() {
  const settings = await prisma.settings.findFirst();
  const defaultMission = "Sessiz dostlarımızın sesi olmak; onlara sevgi, şefkat ve en güncel veteriner hekimlik uygulamaları ile dürüst ve güvenilir bir sağlık hizmeti sunmak.";
  const mission = settings?.about_mission || defaultMission;
  const image = settings?.about_image || "/uploads/vet-clinic-interior.png"; 

  return (
    <main className={styles.main}>
      <section className={styles.heroGradient}>
        <div className="container">
          <h1 className={styles.heroTitle}>Misyonumuz</h1>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutTextContent}>
              <div className={styles.sectionBadge}>
                <i className="fa-solid fa-bullseye"></i> Hakkımızda <span>—</span>
              </div>
              <h2>Amacımız ve<br/><span>Değerlerimiz</span></h2>
              <div className={styles.separator}></div>
              
              <div className={styles.aboutImageContent}>
                <div className={styles.blueShape}></div>
                <div className={styles.aboutImageWrapper}>
                  <Image src={image} alt="Misyonumuz" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={`${styles.floatingPill} ${styles.pill1}`}>
                  <i className="fa-solid fa-heart" style={{color: '#0ea5e9'}}></i> Sevgi Dolu
                </div>
                <div className={`${styles.floatingPill} ${styles.pill2}`}>
                  <i className="fa-solid fa-hand-holding-medical" style={{color: '#0ea5e9'}}></i> Şefkat
                </div>
                <div className={`${styles.floatingPill} ${styles.pill3}`}>
                  <i className="fa-solid fa-shield-halved" style={{color: '#0ea5e9'}}></i> Dürüstlük
                </div>
              </div>

              <div className={styles.textContent}>
                {mission.split('\n').map((line, i) => (
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
            <Link href="/about/vision" className={styles.navLinkBtn}>
              <div className={styles.iconWrap}><i className="fa-solid fa-eye"></i></div>
              <div className={styles.cardText}>
                <h3>Vizyonumuz</h3>
                <p>Gelecek hedeflerimiz</p>
              </div>
              <div className={styles.clickIcon}><i className="fa-solid fa-arrow-pointer"></i></div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
