"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { addTestimonial } from "@/actions/testimonials";
import styles from "./testimonials.module.css";

type Testimonial = {
  id: string;
  owner_name: string;
  pet_name: string | null;
  comment: string;
  rating: number;
  photo: string | null;
  createdAt: Date;
};

// Helper for Turkish "time ago"
function timeAgo(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "az önce";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dakika önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} gün önce`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ay önce`;
  const years = Math.floor(days / 365);
  return `${years} yıl önce`;
}

// Helper for client-side image compression (< 100KB)
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        // Resize if too large
        const MAX_SIZE = 800;
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        
        ctx.drawImage(img, 0, 0, width, height);

        // Attempt compression to get under ~100kb
        let quality = 0.9;
        const compress = () => {
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file);
            if (blob.size > 100 * 1024 && quality > 0.1) {
              quality -= 0.1;
              compress();
            } else {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            }
          }, "image/jpeg", quality);
        };
        compress();
      };
      img.onerror = (e) => reject(e);
    };
    reader.onerror = (e) => reject(e);
  });
}

export default function TestimonialsCarousel({ testimonials, session }: { testimonials: Testimonial[]; session: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [rating, setRating] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for viewing a specific testimonial
  const [viewedTestimonial, setViewedTestimonial] = useState<Testimonial | null>(null);

  const displayItems = testimonials && testimonials.length > 0
    ? (testimonials.length < 6 ? [...testimonials, ...testimonials, ...testimonials] : [...testimonials, ...testimonials])
    : [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setMessage("");

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    formData.set("rating", rating.toString());

    // Handle Image Compression
    const photoFile = formData.get("photo") as File;
    if (photoFile && photoFile.size > 0) {
      try {
        const compressed = await compressImage(photoFile);
        formData.set("photo", compressed);
      } catch (err) {
        console.error("Compression failed", err);
      }
    } else {
      formData.delete("photo");
    }
    
    const result = await addTestimonial(formData);
    
    if (result.error) {
      setMessage(result.error);
      setIsError(true);
      setIsPending(false);
    } else {
      setMessage("Yorumunuz için çok teşekkür ederiz! 🐾");
      setIsError(false);
      setIsPending(false);
      setTimeout(() => {
        setIsOpen(false);
        setMessage("");
      }, 2500);
    }
  }

  function setIsOpen(open: boolean) {
    setIsModalOpen(open);
    if (!open) {
      setMessage("");
      setIsError(false);
    }
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>Mutlu Dostlar</span>
          <h2>Sizden Gelenler</h2>
        </div>
        
        {displayItems.length === 0 ? (
          <div className={styles.emptyState}>
            Henüz yorum bulunmuyor. İlk yorumu siz yapın!
          </div>
        ) : (
          <div className={styles.marqueeContainer}>
            {displayItems.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                className={`${styles.card} ${styles.clickableCard}`}
                onClick={() => setViewedTestimonial(item)}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ opacity: i < item.rating ? 1 : 0.3 }}>★</span>
                      ))}
                    </div>
                    <span className={styles.timeAgo}>{timeAgo(item.createdAt)}</span>
                  </div>
                  {item.photo && (
                    <div className={styles.thumbnailWrapper}>
                      <Image src={item.photo} alt="Pet" fill className={styles.thumbnailImg} />
                    </div>
                  )}
                </div>
                
                <p className={styles.comment}>"{item.comment.length > 100 ? item.comment.substring(0, 100) + '...' : item.comment}"</p>
                
                <div className={styles.authorRow}>
                  <div className={styles.avatar}>
                    {item.owner_name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.authorInfo}>
                    <h4>{item.owner_name}</h4>
                    {item.pet_name && (
                      <p className={styles.petName}><span>{item.pet_name}</span>'nin Ailesi</p>
                    )}
                  </div>
                </div>

                {/* Sliding Hover Overlay */}
                <div className={styles.hoverOverlay}>
                  <i className="fa-solid fa-arrow-right-to-bracket" style={{ fontSize: '2rem', marginBottom: '8px' }}></i>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '1px' }}>Yorumu Oku</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.actionContainer}>
          <button onClick={() => setIsOpen(true)} className={styles.aboutBtn}>
            <div className={styles.btnIcon}><i className="fa-solid fa-comment-dots"></i></div>
            <div className={styles.btnText}>
              <strong>Sen De Yorum Yap</strong>
              <span>Deneyimlerini bizimle paylaş</span>
            </div>
            <i className={`fa-solid fa-arrow-pointer ${styles.clickIcon}`}></i>
          </button>
        </div>
      </div>

      {/* CUTE SUBMISSION POPUP */}
      {isModalOpen && (
        <div className={styles.popupOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
            
            <div className={styles.popupHeader}>
              <div className={styles.cuteIcon}>🐾</div>
              <h3>Düşüncelerinizi Paylaşın</h3>
              <p>Sizin ve sevimli dostunuzun mutluluğu bizim için her şeyden önemli!</p>
            </div>

            {!session ? (
              <div className={styles.loginRequired}>
                <p style={{ margin: "20px 0", fontSize: "1.1rem", color: "var(--text-color)" }}>
                  Yorum yazabilmek için lütfen üye girişi yapın veya kayıt olun.
                </p>
                <Link 
                  href="/admin/login" 
                  className={styles.loginRedirectBtn}
                  onClick={() => setIsOpen(false)}
                >
                  Giriş Yap / Kayıt Ol
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.popupForm}>
                {message && (
                  <div className={isError ? styles.errorMsg : styles.successMsg}>
                    {message}
                  </div>
                )}

                <div className={styles.starSelector}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button"
                      className={star <= rating ? styles.starActive : styles.starInactive}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <div className={styles.inputGroup}>
                  <input type="text" name="owner_name" placeholder="Adınız Soyadınız *" defaultValue={session.user?.name || ""} required />
                </div>

                <div className={styles.inputGroup}>
                  <input type="text" name="pet_name" placeholder="Evcil Dostunuzun Adı (Opsiyonel)" />
                </div>

                <div className={styles.inputGroup}>
                  <textarea name="comment" rows={4} placeholder="Deneyimlerinizi bizimle paylaşın... *" required></textarea>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.photoLabel}>
                    <span className={styles.photoIcon}>📷</span> Fotoğraf Yükle (Opsiyonel)
                    <input type="file" name="photo" accept="image/*" ref={fileInputRef} className={styles.fileInput} />
                  </label>
                </div>

                <button type="submit" disabled={isPending} className={styles.submitBtn}>
                  {isPending ? "Gönderiliyor..." : "Yorumu Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* VIEW TESTIMONIAL FULL MODAL */}
      {viewedTestimonial && (
        <div className={styles.popupOverlay} onClick={() => setViewedTestimonial(null)}>
          <div className={`${styles.popupContent} ${styles.viewModal}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setViewedTestimonial(null)}>&times;</button>
            
            <div className={styles.viewHeader}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ opacity: i < viewedTestimonial.rating ? 1 : 0.3 }}>★</span>
                  ))}
                </div>
                <span className={styles.timeAgo}>{timeAgo(viewedTestimonial.createdAt)}</span>
              </div>
            </div>

            <div className={styles.viewBody}>
              {viewedTestimonial.photo && (
                <div className={styles.fullImageWrapper}>
                  <Image 
                    src={viewedTestimonial.photo} 
                    alt="Pet Photo" 
                    width={600}
                    height={800}
                    className={styles.fullImage} 
                  />
                </div>
              )}
              
              <div className={styles.viewCommentBox}>
                <div className={styles.quoteMark}>"</div>
                <p className={styles.viewCommentText}>{viewedTestimonial.comment}</p>
              </div>
              
              <div className={styles.viewAuthorRow}>
                 <div className={styles.avatar}>
                    {viewedTestimonial.owner_name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.authorInfo}>
                    <h4>{viewedTestimonial.owner_name}</h4>
                    {viewedTestimonial.pet_name && (
                      <p className={styles.petName}><span>{viewedTestimonial.pet_name}</span>'nin Ailesi</p>
                    )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
