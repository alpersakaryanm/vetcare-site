import { prisma } from "@/lib/prisma";
import GalleryGrid from "./GalleryGrid";
import styles from "./public-gallery.module.css";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" }
  });

  const settings = await prisma.settings.findFirst();

  const defaultTitle = "Kliniğimizden Kareler";
  const defaultDesc = "Sevimli dostlarımızın ve kliniğimizin en güzel anlarını buradan inceleyebilirsiniz.";

  const pageTitle = settings?.gallery_page_title || defaultTitle;
  const pageDesc = settings?.gallery_page_desc || defaultDesc;

  return (
    <main style={{ width: '100%' }}>
      <section className={styles.heroGradient}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className={styles.heroTitle}>{pageTitle}</h1>
          <p style={{ maxWidth: '800px', margin: '20px auto 0', fontSize: '1.1rem', color: '#334155', opacity: 0.9 }}>
            {pageDesc}
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <GalleryGrid images={images} />
        </div>
      </section>
    </main>
  );
}
