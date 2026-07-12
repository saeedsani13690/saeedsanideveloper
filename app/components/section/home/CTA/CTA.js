import styles from "./CTA.module.css";
import Link from "next/link";

export default function CTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <h2 className={styles.title}>
          آماده‌ای مسیر برنامه‌نویسی رو شروع کنی؟
        </h2>

        <p className={styles.subtitle}>
          همین الان وارد دوره‌ها شو و اولین قدم رو برای ورود به بازار کار بردار
        </p>

        <div className={styles.actions}>
          <Link href="#last-courses">
            <button className={styles.primary}>
              مشاهده دوره‌ها
            </button>
          </Link>

          <Link href="/aboutme">
            <button className={styles.secondary}>
              درباره ما
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}