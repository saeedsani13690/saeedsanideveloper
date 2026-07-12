"use client"
import styles from "./LastCourse.module.css"
import CourseCard from "../../UI/CourseCard"
import { useEffect, useState } from "react"
import Loader from "../../shered/Loader"
import toast from "react-hot-toast"
export default function LastCourses(){

    const [courses,setCourses]=useState([])
    const [loading,setLoading]=useState(true)
    console.log(courses)

useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses/latest");
      const data = await response.json();
    
      setCourses(data.course || []);
    } catch (error) {
      console.log("ERROR:", error);
      toast.error("خطا در گرفتن اخرین دوره ها");
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);






    return(
        <>
        <div id="last-courses" className="container section ">
<div className="sectionHeader">
    <p className="sectionTitle">اخرین دوره اموزشی</p>
    <p className="sectionMore">همه دوره ها </p>
</div>
<div className={styles.lastCourse}>
  {loading ? (
    <Loader />
  ) : courses.length > 0 ? (
    courses.map((course) => (
      <CourseCard key={course._id} course={course} />
    ))
  ) : (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>📚</div>

      <h3>هنوز هیچ دوره‌ای منتشر نشده است</h3>

      <p>
        در حال آماده‌سازی دوره‌های جدید هستیم.
        <br />
        به‌زودی آموزش‌های پروژه‌محور این بخش اضافه خواهند شد.
      </p>

      <span className={styles.emptyBadge}>
        🚀 به‌زودی منتظر دوره‌های جدید باشید
      </span>
    </div>
  )}
</div>

        </div>
        </>
    )
}