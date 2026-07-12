"use client"

import { useState } from "react"
import styles from "./CourseChapter.module.css"

import { useAuth } from "@/context/authcontext/authcontext"
import toast from "react-hot-toast"
import CoursePlayer from "./CoursePlayer"
import {
  FaLock,
  FaPlayCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function CourseChapter({ course }) {
// برای باز وبسته بلودن فصل ها 
  const [activeChapter, setActiveChapter] = useState(null)

// مشخص میکنه کدوم درس انتخاب شده است 
const [activeLesson, setActiveLesson] = useState(null);

// لینک ویدی اینجا ذخیره میشه 
const [videoUrl, setVideoUrl] = useState("");
const [loadingVideo, setLoadingVideo] = useState(false);
  const {user}=useAuth()

  //ایا دوره خریداری شده است 
const isPurchased=user && user.purchesedCourses?.some(purchesedCourses=>purchesedCourses._id===course._id)
const isAdmin = user?.role === "admin";

// برای باز وبست یک فصل 
  const toggleChapter = (index) => {
    setActiveChapter(activeChapter=== index?null:index)
  }
// برای گرفتن ویدیو 
 const fetchVideo=async(lessonId)=>{
  try{
setLoadingVideo(true);
const response =await fetch("/api/VideoShow",{
  method:"POST",
  headers: {
  "Content-Type": "application/json",
},
body: JSON.stringify({ lessonId }),
})


const data=await response.json()
if (data.success) {
  setVideoUrl(data.url);
}
  }
  
  catch(error){
toast.error(error.message)
  }finally{
    setLoadingVideo(false);
  }
}

// وقتی روی یک درس کلیک شد 
const handleLessonClick=(lessonId)=>{
if(!isAdmin && !isPurchased) return
setActiveLesson(lessonId)
fetchVideo(lessonId);

}






  return (
    <section className={styles.container}>

      <h2 className={styles.title}>سرفصل های دوره</h2>

      {course.chapters.map((chapter, index) => (
        <div key={index} className={styles.chapter}>
          <div
            className={styles.chapterHeader}
            onClick={() => toggleChapter(index)}
          >
            <div className={styles.chapterTitle}>
    <h3>{chapter.title}</h3>
    <span>{chapter.lessons.length} جلسه</span>
  </div>
      {activeChapter===index?(<FaChevronUp className={styles.arrow}/>)
      :(<FaChevronDown className={styles.arrow} />)}
          </div>





          {activeChapter === index && (
            <ul className={styles.lessonList}>

              {chapter.lessons.map((lesson) => (
                <li
                onClick={() => handleLessonClick(lesson._id)}
                 key={lesson._id} className={styles.lessonItem}>

                  <div className={styles.lessonInfo}>
                   {isAdmin || isPurchased ? (
  <FaPlayCircle className={styles.playIcon} />
) : (
  <FaLock  className={styles.lockIcon} />
)}

                    <span>{lesson.title}</span>
                  </div>

                  <div className={styles.lessonMeta}>
  <span>{lesson.duration}</span>

  {!isPurchased && !isAdmin ? (
    <span className={styles.lockText}>
      برای مشاهده باید دوره را خریداری کنید
    </span>
  ) : (
    <span className={styles.lockText}>
      شما دوره را در اختیار دارید
    </span>
  )}
</div>

                </li>
              ))}

            </ul>
          )}

        </div>

      ))}


{ videoUrl && ( <CoursePlayer videoUrl={videoUrl}
    loadingVideo={loadingVideo}    />)}
 

    </section>





  )
}

