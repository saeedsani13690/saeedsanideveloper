import Image from "next/image";
import Link from "next/link";
import styles from "./CourseCard.module.css";
import { FaUsers } from "react-icons/fa";
import { div } from "framer-motion/client";
export default function CourseCard({course}){
    return(
        <>
      
      <div className={styles.card}>
      <div className={styles.imageBox}>

    <Image
      src={course.thumbnail}
      alt={course.title}
      fill
      className={styles.image}
    />
  

  {course.discountPrice && !course.isfree && (
    <div className={styles.badge}>
      {discountPercent(course.price, course.discountPrice)}%
    </div> )}

 

</div>

      <div className={styles.content}>
        <h3 className={styles.title}> {course.title}</h3>

        <p className={styles.description}>
{course.shortDescription}             
        </p>

        <div className={styles.info}>
          <span>سطح: متوسط</span>
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
  <FaUsers fontSize={20} />
  {course.studentsCount}
</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceBox}>
            <span className={styles.oldPrice}>{course.discountPrice?`${course.price.toLocaleString()}تومان`:""} </span>
          <span className={styles.price}>
    {course.isfree?"رایگان": course.discountPrice?`${course.discountPrice.toLocaleString()}تومان`  :course.price.toLocaleString()}
</span>
          </div>

          <Link href={`/coursedeatils/${course.slug}`} className={styles.button}>
            مشاهده دوره
          </Link>
        </div>
      </div>

    </div>
        </>
    )





    
}



function discountPercent(price,discountPrice){
return Math.round(((price-discountPrice)/price)*100)
}