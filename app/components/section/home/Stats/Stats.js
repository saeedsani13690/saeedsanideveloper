import styles from "./Stats.module.css";

export default function Stats() {
  const data = [
    { number: "1200+", label: "دانشجو فعال" },
    { number: "25+", label: "دوره آموزشی" },
    { number: "300+", label: "ساعت آموزش" },
    { number: "95%", label: "رضایت کاربران" },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <h2 className={styles.title}>آمار ما</h2>
        <p className={styles.subtitle}>
          عددهایی که نشان می‌دهند مسیر درستی را انتخاب کرده‌ای
        </p>

        <div className={styles.grid}>

          {data.map((item, index) => (
            <div key={index} className={styles.card}>
              <h3>{item.number}</h3>
              <p>{item.label}</p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}