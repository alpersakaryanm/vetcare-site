import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import styles from "./about.module.css";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await prisma.settings.findFirst();

  const defaultTitle = "Hakkımızda";
  const defaultContent = "Kliniğimiz, yılların getirdiği tecrübe ve hayvan sevgisiyle minik dostlarımıza en iyi sağlık hizmetini sunmak için kuruldu. Modern tıbbi cihazlarımız, laboratuvarımız ve uzman hekim kadromuz ile evcil hayvanlarınızın her türlü sağlık sorununda yanındayız.\n\nSadece hastalık durumlarında değil, koruyucu hekimlik anlayışımızla dostlarımızın sağlıklı ve uzun bir ömür sürmesi için düzenli aşı ve bakım programları oluşturuyoruz.";

  const title = settings?.about_title || defaultTitle;
  const content = settings?.about_content || defaultContent;
  const image = settings?.about_image || "/uploads/vet-clinic-interior.png"; 

  return (
    <main className={styles.main}>
      
      {/* Blue Gradient Header */}
      <section className={styles.heroGradient}>
        <div className="container">
          <h1 className={styles.heroTitle}>{title}</h1>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            
            <div className={styles.aboutTextContent}>
              <div className={styles.sectionBadge}>
                <i className="fa-solid fa-circle-info"></i> Hakkımızda <span>—</span>
              </div>
              
              <h2>Dostlarınız İçin Profesyonel<br/><span>Veteriner Hekimlik</span></h2>
              
              <div className={styles.separator}></div>

              <div className={styles.aboutImageContent}>
                <div className={styles.blueShape}></div>
                
                <div className={styles.aboutImageWrapper}>
                  <Image src={image} alt={title} fill style={{ objectFit: 'cover' }} />
                </div>
                
                <div className={`${styles.floatingPill} ${styles.pill1}`}>
                  <i className="fa-solid fa-check-circle" style={{color: '#0ea5e9'}}></i> Şefkatli Yaklaşım
                </div>
                <div className={`${styles.floatingPill} ${styles.pill2}`}>
                  <i className="fa-solid fa-check-circle" style={{color: '#0ea5e9'}}></i> Modern Teçhizat
                </div>
                <div className={`${styles.floatingPill} ${styles.pill3}`}>
                  <i className="fa-solid fa-check-circle" style={{color: '#0ea5e9'}}></i> Profesyonel Ekip
                </div>
              </div>
              
              <div className={styles.textContent}>
                {content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
            
          </div>

          <div className={styles.bottomNav}>
            <Link href="/about/mission" className={styles.navLinkBtn}>
              <div className={styles.iconWrap}><i className="fa-solid fa-bullseye"></i></div>
              <div className={styles.cardText}>
                <h3>Misyonumuz</h3>
                <p>Değerlerimizi inceleyin</p>
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
