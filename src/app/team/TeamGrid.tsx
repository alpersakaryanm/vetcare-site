"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./team.module.css";

type Veterinarian = {
  id: string;
  name: string;
  title: string;
  photo: string | null;
  specialization: string | null;
  biography: string | null;
};

export default function TeamGrid({ veterinarians }: { veterinarians: Veterinarian[] }) {
  const placeholderImage = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className={styles.grid}>
      {veterinarians.map((vet) => (
        <Link href={`/team/${vet.id}`} key={vet.id} style={{ textDecoration: 'none' }}>
          <div className={styles.card}>
            <div className={styles.photoWrapper}>
              <Image 
                src={vet.photo || placeholderImage} 
                alt={vet.name} 
                fill 
                className={styles.photo}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={styles.hoverOverlay}>
                <i className="fa-solid fa-user-doctor" style={{ fontSize: '2.5rem', marginBottom: '8px' }}></i>
                <span style={{ fontWeight: '700', fontSize: '1.2rem', letterSpacing: '1px' }}>Hekimi Gör</span>
              </div>
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>{vet.name}</h3>
              <span className={styles.title}>{vet.title}</span>
              {vet.specialization && (
                <span className={styles.specialization}>{vet.specialization}</span>
              )}
              <span className={styles.clickHint}>Hekim Seç</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
