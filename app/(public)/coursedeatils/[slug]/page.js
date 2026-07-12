import connectDB from "@/configs/db"
import CourseSchema from "@/models/CourseSchema"
import { notFound } from "next/navigation"
import styles from "./page.module.css"
import CourseInrudection from "@/app/components/section/course/CourseIntrudution"
import CourseDescription from "@/app/components/section/course/CourseDescription"
import CourseChapter from "@/app/components/section/course/CourseChapters"
import CourseComments from "@/app/components/section/course/CourseComments"
import CourseCommentList from "@/app/components/section/course/CourseCommentList"


export default async function CourseDetails({params}){
    const{slug}=await params
    await connectDB()
    const courseDetails=await CourseSchema.findOne({slug}).lean()
   
    if(!courseDetails){
        return notFound()
    }



//برای پاس دادن به یک کامپونتن نمیتونی مستقیم پاس بدی باید تبدیل کنی 
const plainCourse=JSON.parse(JSON.stringify(courseDetails))







//این تابع فصلها رو اول میگیرد درسها رو پیمایش میکنه زمان هر فصل رو به ثانیه میگیرره 
const getCourseStats=(chapters=[])=>{
let totalSeconds = 0
  let totalLessons = 0
const chapterStats=chapters.map(chapter=>{
//این متغیر برای زمان همان فصل است 
// فصل 1 = 45 دقیقه
// فصل 2 = 30 دقیقه
let chapterSeconds = 0
//درسها رو میگیرد 
 const lessons = chapter.lessons || []
 //مپ زدن روی درسها 
lessons.forEach(lesson=>{
// {null undifind ""} 
if (!lesson.duration) return    //عبور کن 
const [minutes, seconds] = lesson.duration.split(":").map(Number)
  const duration = minutes * 60 + seconds //تبذیل به ثانیه داریم میکنیم
chapterSeconds+=duration //زمان هر فصل 
totalSeconds += duration // زمان هر فصل رابه فصلهای دیکه وصل میکینم
totalLessons++  //تعداد جلسات 

})

return {
    //برای هرفصل این اطلاعات ساخته میشود 
  chapterTitle: chapter.title,
  lessonsCount: lessons.length,
  duration: chapterSeconds
}
})
  const totalChapters = chapters.length
  //این تابع این متغیرها رو برمیگرداند 
return {
    totalSeconds,
    totalLessons,
    totalChapters,
    chapterStats
  }
}


//این تابع برای تبدیل ثانیه به ساعت ودقیقه است 
  const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours} ساعت و ${minutes} دقیقه`
}

const stats = getCourseStats(courseDetails.chapters) //این متغیر برای استفاده زمان وتعداد جلسات است 
const totalDuration = formatDuration(stats.totalSeconds) //زمان هر فصل 
const totalLessons = stats.totalLessons //گرفتن تعداد جلسات 

//این متغیر برای تشخصی وضعیت ودره است 
const statusText=courseDetails.statusPeriod==="published"?
"منتشر شده ":courseDetails.statusPeriod==="draft"?
"درحال تکمیل شدن ":"پیش نویس"


const levetText=courseDetails.levelPeriod==="beginner"?
" مبتدی  ":courseDetails.levelPeriod==="intermediad"?
"  متوسط ":" پیشرفته"



    return(
        <>

<div className="container">
<div className={styles.coursedeatailsPage}>
<CourseInrudection 
course={plainCourse}
totalDuration={totalDuration}
totalLessons={totalLessons}
statusText={statusText}
levelText={levetText}
/>


<CourseDescription fullDescription={courseDetails.fullDescription}/>
<CourseChapter course={plainCourse} />
<CourseCommentList course={plainCourse}/>
<CourseComments  course={plainCourse}/>

</div>




</div>
       
        </>
    )
}