import { prisma } from "@/lib/prisma";
import Image from "next/image";
import BlogForm from "./BlogForm";
import BlogEditModal from "./BlogEditModal";
import BlogDeleteButton from "./BlogDeleteButton";
import styles from "./blog.module.css";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Blog Yönetimi</h1>
        <p>Sitenizdeki blog yazılarını buradan ekleyebilir, düzenleyebilir ve silebilirsiniz.</p>
      </div>

      <BlogForm />

      <div className={styles.header} style={{ borderBottom: 'none', paddingBottom: 0, marginTop: '20px' }}>
        <h2>Mevcut Yazılar ({posts.length})</h2>
      </div>

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          Henüz hiç blog yazısı eklenmemiş.
        </div>
      ) : (
        <div className={styles.grid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.card}>
              {post.cover_image && (
                <div className={styles.imagePreview}>
                  <Image src={post.cover_image} alt={post.title} fill />
                </div>
              )}
              
              <div className={styles.cardHeader} style={{ marginTop: post.cover_image ? '10px' : '0' }}>
                <div className={styles.title}>{post.title}</div>
                <div className={styles.meta}>
                  {post.category && <span className={styles.badge}>{post.category}</span>}
                  <span>{post.published_at?.toLocaleDateString("tr-TR")}</span>
                </div>
              </div>
              
              <div className={styles.contentPreview}>
                {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
              </div>
              
              <div className={styles.actionButtons}>
                <BlogEditModal item={post} />
                <BlogDeleteButton id={post.id} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
