import styles from "./WhyUs.module.css";
import { FaCode, FaHeadset, FaRocket } from "react-icons/fa";

export default function WhyUs() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <h2 className={styles.title}>چرا ما؟</h2>
        <p className={styles.subtitle}>
          دلایلی که باعث میشه مسیر یادگیریت سریع‌تر و اصولی‌تر بشه
        </p>

        <div className={styles.grid}>

          <div className={styles.card}>
            <FaCode />
            <h3>آموزش پروژه محور</h3>
            <p>همه چیز رو با ساخت پروژه واقعی یاد می‌گیری</p>
          </div>

          <div className={styles.card}>
            <FaHeadset />
            <h3>پشتیبانی واقعی</h3>
            <p>هرجا گیر کردی، تنها نیستی</p>
          </div>

          <div className={styles.card}>
            <FaRocket />
            <h3>آمادگی بازار کار</h3>
            <p>دقیقاً چیزی که شرکت‌ها می‌خوان یاد می‌گیری</p>
          </div>

        </div>

      </div>
    </section>
  );
}