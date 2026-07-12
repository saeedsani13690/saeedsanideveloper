import styles from "./Roadmap.module.css";

export default function Roadmap() {
  const steps = [
    "HTML / CSS",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js / API",
    "پروژه واقعی و بازار کار",
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <h2 className={styles.title}>مسیر یادگیری</h2>
        <p className={styles.subtitle}>
          قدم به قدم تا تبدیل شدن به برنامه‌نویس حرفه‌ای
        </p>

        <div className={styles.timeline}>

          {steps.map((step, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.circle}>{index + 1}</div>
              <div className={styles.text}>{step}</div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}