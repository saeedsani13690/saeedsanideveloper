"use client";

import styles from "./Footer.module.css";
import { usePathname } from "next/navigation";


export default function FooterSaeed() {
  const pathname=usePathname()


if( pathname.startsWith("/auth") ||
  pathname.startsWith("/admin") || pathname.startsWith("/profile")  ) return null;

  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* info */}
        <div className={styles.info}>
          <h3 className={styles.title}>سعید ثانی</h3>
          <p className={styles.subtitle}>
            توسعه‌دهنده فرانت‌اند و بک‌اند
          </p>
        </div>

        {/* icons */}
        <div className={styles.icons}>

          {/* Email */}
          <a
            href="mailto:test@gmail.com"
            className={styles.icon}
          >
            <svg viewBox="0 0 24 24" className={styles.svg}>
              <path
                fill="currentColor"
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 18V8l8 5 8-5v10H4z"
              />
            </svg>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/elvator1369"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
          >
            <svg viewBox="0 0 24 24" className={styles.svg}>
              <path
                fill="currentColor"
                d="M9.04 15.47 8.9 19.5c.5 0 .72-.22.98-.48l2.36-2.26 4.9 3.58c.9.5 1.55.24 1.78-.83l3.2-15c.3-1.4-.5-1.95-1.4-1.6L2.6 9.4c-1.36.53-1.35 1.3-.24 1.64l5.2 1.62L19.2 6.4c.56-.36 1.07-.16.65.2"
              />
            </svg>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/saeedsani1369"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
          >
            <svg viewBox="0 0 24 24" className={styles.svg}>
              <path
                fill="currentColor"
                d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1-.9-1.3-.9-1.3-.7-.5.1-.5.1-.5.8.1 1.3.8 1.3.8.7 1.3 1.9.9 2.4.7.1-.5.3-.9.6-1.1-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 3 .9a10 10 0 0 1 5.4 0c2.1-1.2 3-.9 3-.9.6 1.4.2 2.5.1 2.8.7.7 1.1 1.6 1.1 2.7 0 3.8-2.4 4.6-4.6 4.9.3.3.6.8.6 1.7v2.5c0 .3.2.6.7.5A10.3 10.3 0 0 0 22 12.3C22 6.6 17.5 2 12 2z"
              />
            </svg>
          </a>

        </div>

      </div>

      <div className={styles.bottom}>
        © {year} ساخته شده توسط سعید ثانی
      </div>
    </footer>
  );
}