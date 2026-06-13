"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/actions/auth";
import styles from "./register.module.css";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    setIsPending(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Kayıt işlemi başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerCard}>
        <h1 className={styles.title}>Kayıt Ol</h1>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Adınız Soyadınız</label>
            <input
              id="name"
              name="name"
              type="text"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              name="email"
              type="email"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          
          <button type="submit" disabled={isPending} className={styles.button}>
            {isPending ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>
        
        <Link href="/admin/login" className={styles.loginLink}>
          Zaten hesabınız var mı? Giriş Yapın
        </Link>
      </div>
    </div>
  );
}
