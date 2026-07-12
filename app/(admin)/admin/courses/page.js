"use client";
// رندر برای دورهای ادمین که میخواد پاک کنه یا ادیت کنه 
import styles from "./Courses.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "@/app/components/shered/Loader";
import Image from "next/image";
import toast from "react-hot-toast";



export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  

  useEffect(() => {
    const timer = setTimeout(() => {
      const getCourses = async () => {
        try {
          setLoading(true);

          const response = await fetch(
            `/api/admin/courses?search=${encodeURIComponent(search)}`
          );

          if (!response.ok) throw new Error("خطا در دریافت دوره‌ها");

          const data = await response.json();
          setCourses(data.courses || []);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      getCourses();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);


//برای پاک کردن یک دوره توسط ادمین
const deletecourse= async(slug)=>{
if(!confirm("مطمینی میخوام دوره رو حذف کنی ")){
  return
}

try{
const response=await fetch(`/api/admin/courses/${slug}`,{method:"DELETE"})
const data=await response.json()
if(data.success){
  setCourses((prevstate)=>prevstate.filter((event)=>event.slug!==slug))
  toast.success("دوره با موفقیت حذف شد ")
}else{
  toast.error("خطا در حذف دوره ")
}


}


catch(error){
toast.error("خطای سرور ",error)
}


  
}


//برای ادیت یک دوره فقط وضعیت دوره
const editstatusperiod=async(slug)=>{
  
try{
const response=await fetch(`/api/admin/courses/${slug}`,{
  method:"PATCH"
})
const data=await response.json()
console.log(data)
if(data.success){
setCourses((prev) =>
  prev.map((course) =>
    course.slug === slug
      ? {
          ...course,
          statusPeriod:
            course.statusPeriod === "published"
              ? "draft"
              : "published",
        }
      : course
  )
);

toast.success(data.message)

}else{
    toast.error(data.message);
}
}
catch(error){
toast.error("خطای سرور");
}
}




  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>مدیریت دوره‌ها</h2>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="جستجو بر اساس عنوان دوره..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className={styles.addBtn}>
          <Link href="/admin/courses/add">افزودن دوره</Link>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>عکس</th>
                <th>عنوان</th>
                <th>قیمت</th>
                <th>تعداد درس‌ها</th>
                <th>وضعیت</th>
                <th>تاریخ ایجاد</th>
                <th>عملیات</th>
              </tr>
            </thead>

            <tbody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course._id}>
                    <td>
                      <div className={styles.imageWrapper}>
                        <Image
                          src={course.thumbnail || "/images/course-placeholder.jpg"}
                          alt={course.title}
                          fill
                          className={styles.image}
                        />
                      </div>
                    </td>

                    <td className={styles.title}>{course.title}</td>

<td>
  {course.isfree ? (
    <span className={styles.freeBadge}>رایگان</span>
  ) : course.discountPrice ? (
    <div className={styles.priceBox}>
      <span className={styles.oldPrice}>
        {course.price.toLocaleString()} تومان
      </span>

      <span className={styles.discountPrice}>
        {course.discountPrice.toLocaleString()} تومان
      </span>
    </div>
  ) : (
    <span className={styles.normalPrice}>
      {course.price.toLocaleString()} تومان
    </span>
  )}
</td>
                    <td>{course.lessonsCount}</td>

                    <td>
                        {course.statusPeriod === "draft" ? (
    <span className={styles.draft}>پیش نویس</span>
  ) : (
    <span className={styles.published}>منتشر شده</span>
  )}
                    </td>

                    <td>
                      {new Date(course.createdAt).toLocaleDateString("fa-IR")}
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <button className={`${styles.btn} ${styles.edit}`}>
                          <Link className={`${styles.btn} ${styles.edit}`}  href={`/admin/courses/${course.slug}/edit`}>
                           ویرایش
                          </Link>
                         
                        </button>

                        <button onClick={()=>editstatusperiod(course.slug)} className={`${styles.btn} ${styles.publish}`}>
                                 {course.statusPeriod === "draft" ? (
    <span className={styles.draft}>پیش نویس</span>
  ) : (
    <span className={styles.published}>منتشر شده</span>
  )}
                        </button>

                        <button onClick={()=>deletecourse(course.slug)} className={`${styles.btn} ${styles.delete}`}>
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.emptyRow}>
                    هیچ دوره‌ای یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
