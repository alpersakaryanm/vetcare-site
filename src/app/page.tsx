import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import TeamCarousel from "@/components/TeamCarousel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const teamMembers = await prisma.veterinarian.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
    take: 6,
  });

  const settings = await prisma.settings.findFirst();
  const numericWhatsapp = settings?.whatsapp ? settings.whatsapp.replace(/\D/g, "") : "";
  const clinicName = settings?.clinic_name || "VetCare";

  return (
    <main className={styles.main}>
      
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>{clinicName}</h1>
              <h2>Veteriner Polikliniği</h2>
              <p>Sizin için birer evlat olan minik dostlarınızın mutluluğu, bizim en büyük ilham kaynağımız. Onların dili sessiz olsa da biz kalplerini duyuyoruz; attıkları her adımda yanlarında, hikayelerinin bir parçası olmaktan mutluluk duyuyoruz.</p>
              
              <div className={styles.shareButtonsGroup}>
                <a 
                  href="https://api.whatsapp.com/send?text=VetCare%20Veteriner%20Poliklini%C4%9Fi%20-%20https://vetcare.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.whatsappBtn}
                >
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp'ta Paylaş
                </a>
                
                <a 
                  href="https://www.facebook.com/sharer/sharer.php?u=https://vetcare.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.facebookBtn}
                >
                  <i className="fa-brands fa-facebook-f"></i> Facebook'ta Paylaş
                </a>
              </div>
              
              <div className={styles.socialBox}>
                <span>Bizi Takip Edin!</span>
                <div className={styles.socialIcons}>
                  {settings?.instagram_link && (
                    <Link href={settings.instagram_link} target="_blank" className={styles.instagramLink}>
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  )}
                  {settings?.facebook_link && (
                    <Link href={settings.facebook_link} target="_blank" className={styles.facebookLink}>
                      <i className="fa-brands fa-facebook-f"></i>
                    </Link>
                  )}
                  {settings?.youtube_link && (
                    <Link href={settings.youtube_link} target="_blank" className={styles.youtubeLink}>
                      <i className="fa-brands fa-youtube"></i>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.heroImageWrapper}>
              <Image 
                src="/images/hero_vet_clinic_1781281471313.png" 
                alt="Veteriner ve Sevimli Köpek" 
                fill 
                style={{ objectFit: 'contain', objectPosition: 'bottom' }} 
                priority
              />
            </div>
            
          </div>
          
        </div>
      </section>

      {/* 2. Quick Info Cards */}
      <section className={styles.quickInfo}>
        <div className="container">
          <div className={styles.infoCardsGrid}>
            
            {settings?.address ? (
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.infoCard}
                style={{ textDecoration: 'none' }}
              >
                <div className={styles.iconWrap}>
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className={styles.cardText}>
                  <h3>Yol Tarifi Alın</h3>
                  <p>Kliniğimize en hızlı şekilde ulaşın</p>
                </div>
                <div className={styles.clickIcon}><i className="fa-solid fa-arrow-pointer"></i></div>
              </a>
            ) : (
              <div className={styles.infoCard}>
                <div className={styles.iconWrap}>
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className={styles.cardText}>
                  <h3>Yol Tarifi Alın</h3>
                  <p>Kliniğimize en hızlı şekilde ulaşın</p>
                </div>
                <div className={styles.clickIcon}><i className="fa-solid fa-arrow-pointer"></i></div>
              </div>
            )}

            <Link href="/contact" className={styles.infoCard} style={{ textDecoration: 'none' }}>
              <div className={styles.iconWrap}>
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className={styles.cardText}>
                <h3>Bizimle İletişime Geçin</h3>
                <p>İletişim Bilgilerimize Ulaşın</p>
              </div>
              <div className={styles.clickIcon}><i className="fa-solid fa-arrow-pointer"></i></div>
            </Link>

          </div>
        </div>
      </section>

      {/* 3. About Preview Section */}
      <section className={styles.aboutPreview}>
        <div className="container">
          <div className={styles.aboutGrid}>
            
            <div className={styles.aboutTextContent}>
              <div className={styles.sectionBadge}>
                <i className="fa-solid fa-circle-info"></i> Hakkımızda <span>—</span>
              </div>
              
              <h2>Dostlarınız İçin Profesyonel<br/><span>Veteriner Hekimlik</span></h2>
              
              <div className={styles.separator}></div>
              
              <p>Biz, siz değerli sahiplerimizin dostlarıyla yakından ilgilenip sürekli iletişim halinde oluyoruz. Onların en ufak bir sorunları bizim için çok önemli olup en kısa sürede müdahale etmekle beraber olası bir sağlık sorununun yaşanmaması için de gerekli kontrolleri kliniğimizde yapıyoruz.</p>
              <p className={styles.boldDesc}>Veteriner Hekim, Hayvan Dostu ve Hayvanlar ayrılmaz bir üçlüdür. Bu üçgen içerisindeki iletişim çok önemli olup özellikle hayvan dostunun eğitiminde Veteriner Hekimlerin katkısı son derece önemlidir.</p>
              
              <Link href="/about" className={styles.aboutBtn}>
                <div className={styles.btnIcon}><i className="fa-solid fa-paw"></i></div>
                <div className={styles.btnText}>
                  <strong>Hakkımızda</strong>
                  <span>Kliniğimiz hakkında bilgi al</span>
                </div>
                <i className="fa-solid fa-arrow-pointer" style={{marginLeft: 'auto'}}></i>
              </Link>
            </div>
            
            <div className={styles.aboutImageContent}>
              <div className={styles.blueShape}></div>
              
              <div className={styles.aboutImageWrapper}>
                <Image src="/uploads/vet-clinic-interior.png" alt="Veteriner" fill style={{ objectFit: 'cover' }} />
              </div>
              
              <div className={`${styles.floatingPill} ${styles.pill1}`}>
                <i className="fa-solid fa-check-circle" style={{color: '#0ea5e9'}}></i> 7/24 Hizmet
              </div>
              <div className={`${styles.floatingPill} ${styles.pill2}`}>
                <i className="fa-solid fa-check-circle" style={{color: '#0ea5e9'}}></i> Uzman Kadro
              </div>
              <div className={`${styles.floatingPill} ${styles.pill3}`}>
                <i className="fa-solid fa-check-circle" style={{color: '#0ea5e9'}}></i> Güvenilir Klinik
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 4. Team Section */}
      <TeamCarousel team={teamMembers} />

      {/* 5. Testimonials Section */}
      <TestimonialsCarousel testimonials={testimonials} session={session} />

    </main>
  );
}
