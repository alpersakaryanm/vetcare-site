"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./team-carousel.module.css";

type Vet = {
  id: string;
  name: string;
  photo: string | null;
  title: string;
  specialization: string | null;
};

export default function TeamCarousel({ team }: { team: Vet[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused) return;
    
    // Autoplay interval
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % team.length);
    }, 3500); // changes every 3.5 seconds
    
    return () => clearInterval(interval);
  }, [team.length, isPaused]);

  const handleInteraction = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000); // Resume after 5 seconds
  };

  const handleCardClick = (e: React.MouseEvent, idx: number) => {
    handleInteraction();
    // If not active, prevent navigation and bring to front instead
    if (idx !== activeIndex) {
      e.preventDefault();
      setActiveIndex(idx);
    }
  };

  const scrollToIndex = (index: number) => {
    handleInteraction();
    let newIndex = index;
    if (newIndex < 0) {
      newIndex = team.length - 1;
    } else if (newIndex >= team.length) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
  };

  if (!team || team.length === 0) return null;

  const getCardStyle = (index: number) => {
    // Calculate distance from active index (with infinite loop wrap-around logic)
    const len = team.length;
    let diff = index - activeIndex;
    
    // Adjust for circular wrap-around if there are enough items
    if (len > 3) {
      if (diff > Math.floor(len / 2)) diff -= len;
      if (diff < -Math.floor(len / 2)) diff += len;
    }

    const absDiff = Math.abs(diff);
    
    const zIndex = 10 - absDiff;
    const scale = diff === 0 ? 1.05 : Math.max(0.7, 1 - absDiff * 0.12);
    // Base translate X + additional offset for outer cards
    const translateX = diff * 180; 
    const opacity = diff === 0 ? 1 : Math.max(0, 1 - absDiff * 0.35);

    return {
      transform: `translateX(calc(-50% + ${translateX}px)) scale(${scale})`,
      zIndex,
      opacity,
      pointerEvents: absDiff > 1 ? 'none' as const : 'auto' as const,
      visibility: absDiff > 2 ? 'hidden' as const : 'visible' as const,
    };
  };

  return (
    <section className={styles.teamSection}>
      <div className="container">
        
        {/* Header */}
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <div className={styles.sectionBadge}>
              <i className="fa-solid fa-circle-info"></i> Ekibimiz <span>—</span>
            </div>
            <h2 className={styles.headerTitle}>Alanında Uzman ve<br/><span>Deneyimli Kadromuz</span></h2>
            <div className={styles.separator}></div>
            <p className={styles.headerDesc}>
              Evcil hayvanlarınız için modern, güvenilir ve kapsamlı veteriner hizmetleri sunuyoruz. Sağlık, teşhis, tedavi ve koruyucu bakımda profesyonel çözümler sağlıyoruz.
            </p>
          </div>
          
          <div className={styles.headerRight}>
            <Link href="/team" className={styles.aboutBtn}>
              <div className={styles.btnIcon}><i className="fa-solid fa-users"></i></div>
              <div className={styles.btnText}>
                <strong>Ekibimiz Hakkında</strong>
                <span>Ekibimiz hakkında detaylı bilgi alın</span>
              </div>
              <i className="fa-solid fa-arrow-pointer" style={{marginLeft: 'auto'}}></i>
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className={styles.carouselWrapper}>
          <div className={styles.carouselTrack}>
            {team.map((vet, idx) => {
              const isActive = idx === activeIndex;
              
              return (
                <Link 
                  href={`/team/${vet.id}`} 
                  key={vet.id} 
                  className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
                  style={getCardStyle(idx)}
                  onClick={(e) => handleCardClick(e, idx)}
                >
                  <div className={styles.imageWrapper}>
                    {vet.photo ? (
                      <Image 
                        src={vet.photo} 
                        alt={vet.name} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <i className="fa-solid fa-user-doctor" style={{fontSize: '5rem', color: '#cbd5e1'}}></i>
                      </div>
                    )}
                  </div>
                  <div className={styles.infoBox}>
                    <h3 className={styles.name}>{vet.name}</h3>
                    <p className={styles.role}>{vet.title}</p>
                    {vet.specialization && (
                      <p style={{fontSize: '0.8rem', marginTop: '4px', opacity: 0.8, color: '#64748b'}}>{vet.specialization}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.navContainer}>
          <div className={styles.navArrows}>
            <button className={styles.navArrow} onClick={() => scrollToIndex(activeIndex - 1)}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className={styles.navArrow} onClick={() => scrollToIndex(activeIndex + 1)}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
