"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import styles from "./public-gallery.module.css";

type GalleryItem = {
  id: string;
  image: string;
  title: string | null;
  category: string | null;
  createdAt: Date;
};

export default function GalleryGrid({ images }: { images: GalleryItem[] }) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = ["All", ...Array.from(new Set(images.map(img => img.category)))];

  const filteredImages = activeCategory === "All" 
    ? images 
    : images.filter(img => img.category === activeCategory);

  if (images.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>Henüz fotoğraf eklenmemiş</h3>
        <p>Çok yakında sevimli dostlarımızın fotoğrafları burada olacak!</p>
      </div>
    );
  }

  return (
    <>
      {/* Category Filters */}
      <div className={styles.filters}>
        {categories.map(cat => (
          <button 
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilter : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "All" ? "Tümü" : 
             cat === "Cats" ? "Kediler" :
             cat === "Dogs" ? "Köpekler" :
             cat === "Birds" ? "Kuşlar" :
             cat === "Rabbits" ? "Tavşanlar" :
             cat === "Clinic" ? "Klinik" : cat}
          </button>
        ))}
      </div>

      <div className={styles.listContainer}>
        {filteredImages.map((img, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={img.id}>
              <div className={styles.aboutGrid}>
                
                {/* Text content */}
                <div className={styles.aboutTextContent} style={{ order: isEven ? 1 : 2 }}>
                  <div className={styles.sectionBadge}>
                    <i className="fa-solid fa-image"></i> {img.category} <span>—</span>
                  </div>
                  
                  <h2>{img.title || "Galerimizden Kareler"}</h2>
                  
                  <div className={styles.separator}></div>
                  
                  <p>
                    Bu fotoğraf <strong>{new Date(img.createdAt).toLocaleDateString('tr-TR')}</strong> tarihinde galerimize eklendi. Kliniğimizden veya sevimli dostlarımızdan güzel bir anı.
                  </p>
                </div>

                {/* Image content */}
                <div 
                  className={styles.aboutImageContent} 
                  style={{ order: isEven ? 2 : 1 }}
                  onClick={() => setSelectedImage(img)}
                >
                  <div className={isEven ? styles.blueShapeRight : styles.blueShapeLeft}></div>
                  
                  <div className={isEven ? styles.imageWrapperRight : styles.imageWrapperLeft}>
                    <Image 
                      src={img.image} 
                      alt={img.title || "Gallery image"} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  
                  <div 
                    className={`${styles.floatingPill} ${isEven ? styles.pillRight : styles.pillLeft}`}
                    style={{ animationDelay: `${(index * 0.73) % 4}s`, animationDuration: `${6 + ((index * 0.5) % 2)}s` }}
                  >
                    <i className="fa-solid fa-paw" style={{color: '#0ea5e9'}}></i> {img.title || img.category}
                  </div>
                </div>
                
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal - using inline styles for critical layout to prevent cache bugs */}
      {selectedImage && mounted && createPortal(
        <div 
          className={styles.modalOverlay} 
          onClick={() => setSelectedImage(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div 
            className={styles.modalContent} 
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '900px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            <button 
              className={styles.closeBtn} 
              onClick={() => setSelectedImage(null)}
              style={{ position: 'absolute', top: '-40px', right: '0', background: 'transparent', color: 'white', border: 'none', fontSize: '2.5rem', cursor: 'pointer', zIndex: 100000 }}
            >
              &times;
            </button>
            <div className={styles.modalImageWrapper} style={{ position: 'relative', width: '100%', height: '75vh' }}>
              <Image
                src={selectedImage.image}
                alt={selectedImage.title || "Büyütülmüş fotoğraf"}
                fill
                style={{ objectFit: 'contain' }}
                sizes="100vw"
              />
            </div>
            {(selectedImage.title || selectedImage.category) && (
              <div className={styles.modalInfo} style={{ marginTop: '16px', textAlign: 'center', color: 'white' }}>
                {selectedImage.title && <h2 style={{ marginBottom: '8px', fontSize: '1.5rem' }}>{selectedImage.title}</h2>}
                <div className={styles.modalMetaRow} style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <span className={styles.category}>{selectedImage.category}</span>
                  <span className={styles.modalDate}>{new Date(selectedImage.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
