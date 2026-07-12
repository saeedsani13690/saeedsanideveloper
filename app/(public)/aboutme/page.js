import styles from "./page.module.css";

export default function AboutMe() {
  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>مدرس طراحی سایت</span>

          <h2 className={styles.title}>
            سلام، من سعید ثانی هستم 
          </h2>

          <p className={styles.description}>
            به دنیای طراحی سایت خوش آمدید. من به شما کمک می‌کنم
            طراحی سایت را از صفر تا ورود به بازار کار یاد بگیرید.
            تمام آموزش‌های من بر اساس تجربه واقعی و پروژه‌های عملی
            تهیه شده‌اند تا بتوانید مهارت کسب کنید و درآمد داشته باشید.
          </p>

          <div className={styles.stats}>
            <div>
              <h3>+500</h3>
              <span>دانشجو</span>
            </div>

            <div>
              <h3>+50</h3>
              <span>پروژه</span>
            </div>

            <div>
              <h3>98%</h3>
              <span>رضایت</span>
            </div>
          </div>

          <button className={styles.button}>
            مشاهده دوره‌ها
          </button>
        </div>

        <div className={styles.imageWrapper}>
          <img
            src="\images\photo_2024-09-18_02-10-00.jpg"
            alt="Saeed Sani"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}