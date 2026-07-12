import styles from "./CourseDescription.module.css"
import DOMPurify from "isomorphic-dompurify"

export default function CourseDescription({ fullDescription }) {

  const cleanHTML = DOMPurify.sanitize(fullDescription || "")

  return (
    <section className={styles.section}>
      <h1 className={styles.titlefulldecription}>
        توضیحات کامل دوره
      </h1>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
      />
    </section>
  )
}
