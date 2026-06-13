import { prisma } from "@/lib/prisma";
import styles from "./contact.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <section className={styles.contactSection}>
      <div className="container">
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <div className={styles.sectionBadge}>
              <i className="fa-solid fa-address-book"></i> İletişim <span>—</span>
            </div>
            <h2 className={styles.headerTitle}>Bize Ulaşın ve<br/><span>Randevu Alın</span></h2>
            <div className={styles.separator}></div>
            <p className={styles.headerDesc}>
              Sorularınız, randevu talepleriniz veya acil durumlar için aşağıdaki bilgilerden bizimle iletişime geçebilirsiniz. Kliniğimiz sizlere yardımcı olmaktan mutluluk duyacaktır.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Adres */}
          {settings?.address && (
            <a href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`} target="_blank" rel="noopener noreferrer" className={styles.card}>
              <div className={styles.iconWrapper}>
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className={styles.cardText}>
                <h3>Kliniğimiz</h3>
                <p style={{ fontSize: '0.8rem' }}>{settings.address}</p>
              </div>
              <div className={styles.arrowIcon}>
                <i className="fa-solid fa-arrow-pointer"></i>
              </div>
            </a>
          )}

          {/* Telefon Numarası */}
          {settings?.phone && (
            <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className={styles.card}>
              <div className={styles.iconWrapper}>
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className={styles.cardText}>
                <h3>Bizi Arayın</h3>
                <p>{settings.phone}</p>
              </div>
              <div className={styles.arrowIcon}>
                <i className="fa-solid fa-arrow-pointer"></i>
              </div>
            </a>
          )}

          {/* E-posta Gönderin */}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className={styles.card}>
              <div className={styles.iconWrapper}>
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className={styles.cardText}>
                <h3>Bize Yazın</h3>
                <p>{settings.email}</p>
              </div>
              <div className={styles.arrowIcon}>
                <i className="fa-solid fa-arrow-pointer"></i>
              </div>
            </a>
          )}
        </div>
        
        {/* Map Section */}
        <div className={styles.lowerSection}>
          <div className={styles.mapWrapper}>
            <iframe 
              src="https://www.google.com/maps?q=Selçuk+Bey+Mahallesi,+660+Sokak,+Merkezefendi+Denizli&output=embed" 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {(settings?.instagram_link || settings?.facebook_link || settings?.youtube_link) && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
             <p style={{ color: '#64748b', marginBottom: '15px' }}>Bizi Takip Edin</p>
             <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '1.5rem' }}>
               {settings?.instagram_link && (
                 <a href={settings.instagram_link} target="_blank" rel="noreferrer" style={{ color: 'var(--secondary-color, #1a8cc4)' }}>
                   <i className="fa-brands fa-instagram"></i>
                 </a>
               )}
               {settings?.facebook_link && (
                 <a href={settings.facebook_link} target="_blank" rel="noreferrer" style={{ color: 'var(--secondary-color, #1a8cc4)' }}>
                   <i className="fa-brands fa-facebook"></i>
                 </a>
               )}
               {settings?.youtube_link && (
                 <a href={settings.youtube_link} target="_blank" rel="noreferrer" style={{ color: 'var(--secondary-color, #1a8cc4)' }}>
                   <i className="fa-brands fa-youtube"></i>
                 </a>
               )}
             </div>
          </div>
        )}
      </div>
    </section>
  );
}
