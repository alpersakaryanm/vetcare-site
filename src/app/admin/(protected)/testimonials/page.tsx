import { prisma } from "@/lib/prisma";
import Image from "next/image";
import TestimonialDeleteButton from "./TestimonialDeleteButton";
import TestimonialEditModal from "./TestimonialEditModal";
import TestimonialSettingsForm from "./TestimonialSettingsForm";
import styles from "./testimonials.module.css";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" }
  });
  
  const settings = await prisma.settings.findFirst();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Müşteri Yorumları</h1>
        <p>Anasayfada görünen yorumları buradan düzenleyebilir ve silebilirsiniz.</p>
      </div>

      <TestimonialSettingsForm settings={settings} />

      {testimonials.length === 0 ? (
        <div className={styles.emptyState}>
          Henüz hiç yorum yapılmamış.
        </div>
      ) : (
        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.author}>{t.owner_name}</div>
                  {t.pet_name && <div className={styles.pet}>{t.pet_name}'nin Ailesi</div>}
                </div>
                <div className={styles.stars}>
                  {"★".repeat(t.rating)}
                  <span style={{ opacity: 0.3 }}>{"★".repeat(5 - t.rating)}</span>
                </div>
              </div>
              
              <div className={styles.comment}>"{t.comment}"</div>

              {t.photo && (
                <div className={styles.imagePreview}>
                  <Image src={t.photo} alt="Yüklenen Fotoğraf" fill />
                </div>
              )}
              
              <div className={styles.actionButtons}>
                <TestimonialEditModal item={t} />
                <TestimonialDeleteButton id={t.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
