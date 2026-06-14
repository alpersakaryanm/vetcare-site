import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "../blog.module.css";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return { title: "Yazı Bulunamadı" };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.content.substring(0, 150),
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero} style={{ padding: "80px 0 100px", minHeight: "auto" }}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/blog" style={{ color: "#334155", textDecoration: "none", opacity: 0.8, display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <i className="fa-solid fa-arrow-left"></i> Blog'a Dön
          </Link>
        </div>
      </section>

      <section className={styles.detailSection}>
        <div className={styles.detailCard}>
          <div className={styles.aboutGrid}>
            
            {/* Left Side: Content */}
            <div className={styles.aboutTextContent}>
              <div className={styles.sectionBadge}>
                <i className="fa-solid fa-pen-nib"></i> Blog <span>—</span>
              </div>
              
              <h1>{post.title}</h1>
              
              <div className={styles.separator}></div>
              
              <div className={styles.detailMeta}>
                {post.category && <span><i className="fa-solid fa-tag"></i> {post.category}</span>}
                <span><i className="fa-regular fa-calendar"></i> {post.published_at?.toLocaleDateString("tr-TR")}</span>
                {post.author && <span><i className="fa-regular fa-user"></i> {post.author}</span>}
              </div>

              <p>{post.content}</p>
            </div>
            
            {/* Right Side: Image with Floating Pills */}
            <div className={styles.aboutImageContent}>
              <div className={styles.blueShape}></div>
              
              <div className={styles.aboutImageWrapper}>
                {post.cover_image ? (
                  <Image 
                    src={post.cover_image} 
                    alt={post.title} 
                    fill 
                    style={{ objectFit: "cover" }} 
                    priority
                  />
                ) : (
                  <div style={{width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <i className="fa-solid fa-paw" style={{fontSize: '5rem', color: '#cbd5e1'}}></i>
                  </div>
                )}
              </div>
              
              {/* Fake Floating Pills for aesthetics as requested */}
              <div className={`${styles.floatingPill} ${styles.pill1}`}>
                <i className="fa-solid fa-check-circle" style={{color: '#0ea5e9'}}></i> Uzman Bilgisi
              </div>
              <div className={`${styles.floatingPill} ${styles.pill2}`}>
                <i className="fa-solid fa-check-circle" style={{color: '#0ea5e9'}}></i> VetCare
              </div>
              <div className={`${styles.floatingPill} ${styles.pill3}`}>
                <i className="fa-solid fa-check-circle" style={{color: '#0ea5e9'}}></i> Güncel İçerik
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}
