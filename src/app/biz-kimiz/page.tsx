import { prisma } from "@/lib/prisma";
import Image from "next/image";
import styles from "./biz-kimiz.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BizKimizPage() {
  const settings = await prisma.settings.findFirst();
  const servicesCount = await prisma.service.count({ where: { active: true } });
  const vetCount = await prisma.veterinarian.count({ where: { active: true } });

  const displayServices = servicesCount > 0 ? servicesCount : 12;
  const displayVets = vetCount > 0 ? vetCount : 5;

  const features = [
    { id: 1, icon: "fa-star", value: "%100", title: "Hasta Memnuniyeti", link: "/about" },
    { id: 2, icon: "fa-heart-pulse", value: "7/24", title: "Acil ve Şefkat", link: "/contact" },
    { id: 3, icon: "fa-user-doctor", value: displayVets, title: "Uzman Hekim", link: "/team" },
    { id: 4, icon: "fa-shield-halved", value: "Tam", title: "Steril Ortam", link: "/gallery" },
    { id: 5, icon: "fa-eye", value: "Öncü", title: "Vizyonumuz", link: "/about/vision" },
    { id: 6, icon: "fa-stethoscope", value: `+${displayServices}`, title: "Farklı Hizmet", link: "/services" },
    { id: 7, icon: "fa-bullseye", value: "Sevgi", title: "Misyonumuz", link: "/about/mission" },
    { id: 8, icon: "fa-award", value: "10+", title: "Yıllık Deneyim", link: "/about" },
    { id: 9, icon: "fa-microscope", value: "İleri", title: "Modern Teçhizat", link: "/gallery" },
  ];

  return (
    <main style={{ width: '100%' }}>
      <section className={styles.heroGradient}>
        <div className="container">
          <h1 className={styles.heroTitle}>Biz Kimiz?</h1>
          <p style={{ maxWidth: '700px', margin: '20px auto 0', fontSize: '1.1rem', opacity: 0.9 }}>
            Alanında uzman kadromuz, modern teknolojimiz ve evcil dostlarımıza olan sonsuz sevgimizle, onların sağlığı ve mutluluğu için 7/24 yanınızdayız.
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.grid}>
            {features.map((f) => (
              <div key={f.id} className={styles.card}>
                <div className={styles.photoWrapper}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <i className={`fa-solid ${f.icon}`} style={{ fontSize: '2.2rem', color: '#cbd5e1' }}></i>
                    <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary-color)', lineHeight: '1' }}>{f.value}</span>
                  </div>
                  <div className={styles.hoverOverlay}>
                    <i className={`fa-solid ${f.icon}`} style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{f.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
