"use client";

import { signOut } from "next-auth/react";
import styles from "./admin.module.css";

export default function AdminLayoutClient() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      className={styles.logoutBtn}
      onClick={handleLogout}
      type="button"
    >
      Çıkış Yap
    </button>
  );
}
