import styles from "./Testimonials.module.css";
import { FaStar } from "react-icons/fa";

export default function Testimonials() {
  const comments = [
    {
      name: "علی محمدی",
      text: "واقعا دوره‌ها عالی بودن، تونستم اولین پروژه فریلنسریمو بگیرم",
    },
    {
      name: "سارا کریمی",
      text: "پشتیبانی خیلی سریع جواب میده، حس تنها بودن نداری",
    },
    {
      name: "رضا حسینی",
      text: "از صفر شروع کردم و الان React کار می‌کنم",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <h2 className={styles.title}>نظر دانشجوها</h2>
        <p className={styles.subtitle}>
          تجربه واقعی کسایی که مسیر یادگیری رو با ما رفتن
        </p>

        <div className={styles.grid}>

          {comments.map((item, index) => (
            <div key={index} className={styles.card}>

              <div className={styles.stars}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>

              <p className={styles.text}>
                "{item.text}"
              </p>

              <h4 className={styles.name}>
                {item.name}
              </h4>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}