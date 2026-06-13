"use client";

import { useState } from "react";
import styles from "./whatsapp.module.css";

export default function WhatsAppFloat({ settings }: { settings?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Eğer settings.whatsapp yoksa butonu hiç gösterme
  if (!settings?.whatsapp) {
    return null;
  }

  // Sadece rakamları ayıkla (tel: ve wa.me linkleri için)
  const numericPhone = settings.whatsapp.replace(/\D/g, "");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.whatsappContainer}>
      {/* Pop-up Chat Penceresi */}
      {isOpen && (
        <div className={`${styles.chatWindow} animate-fade-in`}>
          <div className={styles.chatHeader}>
            <div className={styles.chatHeaderInfo}>
              <i className="fa-brands fa-whatsapp"></i>
              <span>{settings?.clinic_name || "VetCare"} Destek Hattı</span>
            </div>
            <button className={styles.closeBtn} onClick={toggleChat}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div className={styles.chatBody}>
            <div className={styles.chatMessage}>
              <p>Merhaba! Size nasıl yardımcı olabiliriz?</p>
              <span className={styles.messageTime}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
          
          <div className={styles.chatFooter}>
            <a 
              href={`https://wa.me/${numericPhone}`}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.startChatBtn}
            >
              <i className="fa-brands fa-whatsapp"></i> Sohbeti Başlat
            </a>
          </div>
        </div>
      )}

      {/* Ana Float Buton */}
      <button 
        className={`${styles.floatBtn} ${isOpen ? styles.floatBtnActive : ''}`} 
        onClick={toggleChat}
        title="WhatsApp Destek"
      >
        {isOpen ? (
          <i className="fa-solid fa-xmark"></i>
        ) : (
          <i className="fa-brands fa-whatsapp"></i>
        )}
      </button>
    </div>
  );
}
