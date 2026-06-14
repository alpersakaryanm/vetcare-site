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
      <section className={styles.hero} style={{ padding: "120px 0 40px", minHeight: "auto" }}>
        <div className="container">
          <Link href="/blog" style={{ color: "white", textDecoration: "none", opacity: 0.8, display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <i className="fa-solid fa-arrow-left"></i> Blog'a Dön
          </Link>
        </div>
      </section>

      <section className={styles.detailSection}>
        <div className="container">
          <article className={styles.detailArticle}>
            <div className={styles.detailHeader}>
              {post.category && <div className={styles.detailCategory}>{post.category}</div>}
              <h1>{post.title}</h1>
              
              <div className={styles.detailMeta}>
                <span><i className="fa-regular fa-calendar"></i> {post.published_at?.toLocaleDateString("tr-TR")}</span>
                {post.author && <span><i className="fa-regular fa-user"></i> {post.author}</span>}
              </div>
            </div>

            {post.cover_image && (
              <div className={styles.detailImageWrapper}>
                <Image 
                  src={post.cover_image} 
                  alt={post.title} 
                  fill 
                  style={{ objectFit: "cover" }} 
                  priority
                />
              </div>
            )}

            <div className={styles.detailContent}>
              {post.content}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
