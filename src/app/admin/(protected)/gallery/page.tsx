import { prisma } from "@/lib/prisma";
import Image from "next/image";
import GalleryForm from "./GalleryForm";
import GalleryDeleteButton from "./GalleryDeleteButton";
import GalleryEditModal from "./GalleryEditModal";
import styles from "./gallery.module.css";

export default async function AdminGalleryPage() {
  const images = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" }
  });

  const uniqueCategories = Array.from(new Set(images.map(img => img.category).filter(Boolean)))
    .filter(cat => !['Cats', 'Dogs', 'Birds', 'Rabbits', 'Clinic'].includes(cat as string)) as string[];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Galeri Yönetimi</h1>
        <p>Klinik fotoğraflarını buradan ekleyip silebilirsiniz.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <GalleryForm existingCategories={uniqueCategories} />
        </div>
        
        <div className={styles.mainGrid}>
          {images.length === 0 ? (
            <div className={styles.emptyState}>Henüz resim eklenmemiş.</div>
          ) : (
            <div className={styles.grid}>
              {images.map((img) => (
                <div key={img.id} className={styles.imageCard}>
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={img.image} 
                      alt={img.title || "Gallery image"} 
                      fill 
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className={styles.imageInfo}>
                    <h4>{img.title || "İsimsiz"}</h4>
                    <span className={styles.categoryBadge}>{img.category}</span>
                    <div className={styles.actionButtons}>
                      <GalleryEditModal item={img} existingCategories={uniqueCategories} />
                      <GalleryDeleteButton id={img.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
