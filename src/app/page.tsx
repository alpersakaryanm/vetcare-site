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

  const latestBlogPosts = await prisma.blogPost.findMany({
    orderBy: { published_at: "desc" },
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
              <div className={styles.glowEffect}></div>
              
              {/* Ayı Patisi (5 parmaklı) */}
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className={`${styles.floatingPaw} ${styles.pawBear}`}>
                <ellipse cx="15" cy="45" rx="7" ry="10" transform="rotate(-35 15 45)" />
                <ellipse cx="32" cy="25" rx="7" ry="11" transform="rotate(-15 32 25)" />
                <ellipse cx="50" cy="18" rx="7" ry="11" />
                <ellipse cx="68" cy="25" rx="7" ry="11" transform="rotate(15 68 25)" />
                <ellipse cx="85" cy="45" rx="7" ry="10" transform="rotate(35 85 45)" />
                <path d="M15,70 C5,85 30,95 50,95 C70,95 95,85 85,70 C75,55 25,55 15,70 Z" />
              </svg>

              {/* Köpek Patisi (4 parmaklı, uzun) */}
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className={`${styles.floatingPaw} ${styles.pawDog}`}>
                <ellipse cx="25" cy="40" rx="6" ry="10" transform="rotate(-30 25 40)" />
                <ellipse cx="40" cy="20" rx="6" ry="11" transform="rotate(-10 40 20)" />
                <ellipse cx="60" cy="20" rx="6" ry="11" transform="rotate(10 60 20)" />
                <ellipse cx="75" cy="40" rx="6" ry="10" transform="rotate(30 75 40)" />
                <path d="M25,65 C20,80 40,95 50,95 C60,95 80,80 75,65 C70,50 30,50 25,65 Z" />
              </svg>

              {/* Kedi Patisi (4 parmaklı, yuvarlak) */}
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className={`${styles.floatingPaw} ${styles.pawCat}`}>
                <circle cx="25" cy="45" r="7" />
                <circle cx="40" cy="25" r="7" />
                <circle cx="60" cy="25" r="7" />
                <circle cx="75" cy="45" r="7" />
                <path d="M25,70 C15,80 35,90 50,90 C65,90 85,80 75,70 C65,60 35,60 25,70 Z" />
              </svg>

              <div className={styles.heroImageInner}>
                <Image 
                  src={settings?.hero_image || "/images/hero_vet_clinic_1781281471313.png"} 
                  alt="Veteriner ve Sevimli Köpek" 
                  fill 
                  style={{ objectFit: 'contain', objectPosition: 'bottom' }} 
                  priority
                />
              </div>
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

      {/* 4. Blog Preview Section (Experimental) */}
      <section className={styles.blogPreviewSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Blog'dan <span>Son Yazılar</span></h2>
            <p>Sevimli dostlarımız hakkında faydalı bilgiler ve ipuçları.</p>
          </div>
          
          <div className={styles.blogGrid}>
            {latestBlogPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className={styles.blogCardCompact}>
                <div className={styles.blogImageCompact}>
                  {post.cover_image ? (
                    <Image src={post.cover_image} alt={post.title} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div className={styles.placeholderCompact}><i className="fa-solid fa-paw"></i></div>
                  )}
                  {post.category && <div className={styles.categoryCompact}>{post.category}</div>}
                </div>
                <div className={styles.blogContentCompact}>
                  <h3>{post.title}</h3>
                  <div className={styles.blogMetaCompact}>
                    <span><i className="fa-regular fa-calendar"></i> {post.published_at?.toLocaleDateString("tr-TR")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Link href="/blog" className={styles.viewAllBlogBtn}>
              Tüm Blog Yazılarını Gör <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Team Section */}
      <TeamCarousel team={teamMembers} />

      {/* 5. Testimonials Section */}
      <TestimonialsCarousel testimonials={testimonials} session={session} />

    </main>
  );
}
