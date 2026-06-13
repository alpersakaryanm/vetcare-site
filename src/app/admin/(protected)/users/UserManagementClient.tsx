"use client";

import { useState } from "react";
import { promoteUserByEmail, updateUserRole } from "@/actions/auth";
import styles from "./users.module.css";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
};

export default function UserManagementClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [emailInput, setEmailInput] = useState("");
  const [roleInput, setRoleInput] = useState("Administrator");
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handlePromote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await promoteUserByEmail(formData);

    setIsPending(false);

    if (result.error) {
      setMessage({ text: result.error, isError: true });
    } else {
      setMessage({ text: "Kullanıcı başarıyla güncellendi!", isError: false });
      setEmailInput("");
      
      // Reload/refresh users list client side
      // In a real app we'd fetch or use router.refresh(), let's update local state as well
      const updatedUsers = users.map(u => {
        if (u.email === emailInput.trim()) {
          return { ...u, role: roleInput };
        }
        return u;
      });
      
      // If the user was not in list or role wasn't updated, let's refresh page
      window.location.reload();
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setMessage(null);
    const result = await updateUserRole(userId, newRole);

    if (result.error) {
      setMessage({ text: result.error, isError: true });
    } else {
      setMessage({ text: "Kullanıcı rolü güncellendi!", isError: false });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  return (
    <div className="users-page">
      <div className={styles.header}>
        <h1>Yöneticiler & Üyeler</h1>
      </div>

      <div className={styles.promoteCard}>
        <h3>E-posta ile Yetki Ata</h3>
        <form onSubmit={handlePromote} className={styles.formInline}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Kullanıcı E-posta Adresi *"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
          </div>
          <div className={styles.selectGroup}>
            <select 
              name="role" 
              value={roleInput} 
              onChange={(e) => setRoleInput(e.target.value)}
            >
              <option value="Administrator">Yönetici (Administrator)</option>
              <option value="Editor">Editör (Editor)</option>
              <option value="Receptionist">Resepsiyonist</option>
              <option value="Member">Normal Üye (Member)</option>
            </select>
          </div>
          <button type="submit" disabled={isPending} className={styles.btn}>
            {isPending ? "Güncelleniyor..." : "Yetki Ata"}
          </button>
        </form>

        {message && (
          <div className={`${styles.message} ${message.isError ? styles.errorMsg : styles.successMsg}`}>
            {message.text}
          </div>
        )}
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Mevcut Rol</th>
              <th>Rol Değiştir</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name || "—"}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.badge} ${
                    user.role === "Administrator" ? styles.badgeAdmin :
                    user.role === "Editor" ? styles.badgeEditor :
                    styles.badgeMember
                  }`}>
                    {user.role === "Administrator" ? "Yönetici" :
                     user.role === "Editor" ? "Editör" :
                     user.role === "Receptionist" ? "Resepsiyonist" : "Normal Üye"}
                  </span>
                </td>
                <td>
                  <select
                    className={styles.roleSelect}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="Administrator">Yönetici</option>
                    <option value="Editor">Editör</option>
                    <option value="Receptionist">Resepsiyonist</option>
                    <option value="Member">Normal Üye</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
