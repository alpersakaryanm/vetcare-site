import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import styles from "./blog.module.css";

export const metadata = {
  title: "Blog | Güncel Bilgiler",
  description: "Canlı dostlarımız için sağlık rehberi, eğitim tüyoları ve güncel veteriner hekimlik bilgileri.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { published_at: "desc" },
  });

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1>Bilgi Kaynağımız</h1>
            <p>Sevimli dostlarınızın sağlığı, beslenmesi ve bakımı hakkında uzman yazıları.</p>
          </div>
        </div>
      </section>

      <section className={styles.blogSection}>
        <div className="container">
          {posts.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fa-solid fa-pen-nib"></i>
              <h2>Henüz Yazı Yok</h2>
              <p>Blog yazılarımız yakında burada olacak. Lütfen daha sonra tekrar ziyaret edin.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {posts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {post.cover_image ? (
                      <Image 
                        src={post.cover_image} 
                        alt={post.title} 
                        fill 
                        style={{ objectFit: "cover" }} 
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <i className="fa-solid fa-paw"></i>
                      </div>
                    )}
                    {post.category && <div className={styles.categoryBadge}>{post.category}</div>}
                  </div>
                  
                  <div className={styles.cardContent}>
                    <div className={styles.meta}>
                      <span><i className="fa-regular fa-calendar"></i> {post.published_at?.toLocaleDateString("tr-TR")}</span>
                      {post.author && <span><i className="fa-regular fa-user"></i> {post.author}</span>}
                    </div>
                    <h2>{post.title}</h2>
                    <p>{post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content}</p>
                    <div className={styles.readMore}>
                      Devamını Oku <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
