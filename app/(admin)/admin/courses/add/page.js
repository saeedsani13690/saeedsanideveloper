
"use client";
import styles from "./Addcourse.module.css";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "@/app/components/shered/Loader";
import axios from "axios";
import UploadProgress from "@/app/components/shered/uploadProgress/UploadProgres";





export default function Addcourse(){
const [thumbnail,setThumbnail]=useState(null)
const [thumbnailPreview,setThumbnailPreview]=useState(null)
const [loading,setLoading]=useState(false)
const [openChapters,setOpenChapters]=useState(0)
const [chapters,setchapters]=useState(
  [
{title:"",lessons:[{title:"",duration:"",isfree:false,videoKey:"" ,uploading: false,progress: 0,processing: false,}]}
]
)
const [formdata, setFormdata] = useState({
title: "",
slug: "",
shortDescription: "",
fullDescription: "",
price: "",
discountPrice: "",
isfree: false,
levelPeriod: "beginner",
statusPeriod: "draft",
category: "",
tags: ""
});
//تابع برای فرستادم به مونگو دی بی است 
const handlersaveformdata= async()=>{
if(!formdata.title.trim()){
return toast.error("عنوان الزامی است")
}

if(!formdata.slug.trim()){
return toast.error("slug ضرورری است")
}



const data=new FormData()
data.append("title",formdata.title)
data.append("slug",formdata.slug)
data.append("shortDescription",formdata.shortDescription)
data.append("fullDescription",formdata.fullDescription)
data.append("discountPrice",formdata.discountPrice || "")
data.append("price",formdata.price || 0)
data.append("isfree",formdata.isfree)
data.append("levelPeriod",formdata.levelPeriod)
data.append("statusPeriod",formdata.statusPeriod)
if(thumbnail) data.append("thumbnail",thumbnail)
data.append("chapters",JSON.stringify(chapters))




try{
  setLoading(true)
const response =await fetch("/api/admin/courses/add",{
method:"POST",
body:data
})

const result=await response.json()
console.log(result)

if(result.success){

toast.success("عملیات با موفقیت انجام شد")

setFormdata({
title: "",
slug: "",
shortDescription: "",
fullDescription: "",
price: "",
discountPrice: "",
isfree: false,
levelPeriod: "beginner",
statusPeriod: "draft",
category: "",
tags: ""
})

setThumbnail(null)
setThumbnailPreview(null)
setchapters(  [
{title:"",lessons:[{title:"",duration:"",isfree:false,videoKey:""}]}
])

}else{
toast.error(result.message)
}

}catch(error){
toast.error("خطا در ارسال اطلاعات")
}finally{
  setLoading(false)
}


}

//این تابع برای هندل کردن مقادیر   درسها است 
const updatelesson = (chIndex, lessonIndex, field, value) => {

  setchapters((prev)=>{

    const updated = prev.map((chapter,cIndex)=>{

      if(cIndex !== chIndex) return chapter;

      return {
        ...chapter,
        lessons: chapter.lessons.map((lesson,lIndex)=>{

          if(lIndex !== lessonIndex) return lesson;

          return {
            ...lesson,
            [field]: value
          };

        })
      };

    });


    

    return updated;

  });

};

// برای اپلود ویدیو در اروان کلود وبرگردانند ادرس ان 
const handleVideoUpload = async (
  file,
  chIndex,
  lesIndex,
  slug,
  chaptertitle
) => {
 


  if (!file || !slug || !chaptertitle) {
    toast.error("اسلاگ و عنوان فصل الزامی است");
    return;
  }


  const videoFormData = new FormData();
  videoFormData.append("video", file);
  videoFormData.append("slug", slug);
  videoFormData.append("chaptertitle", chaptertitle);
  const oldVideoKey = chapters[chIndex].lessons[lesIndex].videoKey;

updatelesson(
  chIndex,
  lesIndex,
  "uploading",
  true
);

updatelesson(
  chIndex,
  lesIndex,
  "processing",
  false
);
updatelesson(
  chIndex,
  lesIndex,
  "progress",
  0
);






  // حذف ویدیوی قبلی
 if(oldVideoKey){
 const deleteFormData=new FormData()
 deleteFormData.append("videoKey",oldVideoKey)

 const deleteRes=await fetch("/api/admin/uploadVideo",{
  method:"DELETE",
  body:deleteFormData
 })

 const deleteData=await deleteRes.json()
  if (deleteData.success) {
    toast.success("ویدیو قبلی حذف شد");
  }else{
    toast.error(deleteData.message)
  }

 }





  try {
    const res = await axios.post("/api/admin/uploadVideo",
videoFormData,{
  headers:{"Content-Type": "multipart/form-data",},
  onUploadProgress:(ProgressEvent)=>{
    const percent=Math.round(
(ProgressEvent.loaded*100)/ProgressEvent.total) 

if(percent==100){
    updatelesson(
    chIndex,
    lesIndex,
    "processing",
    true
  );
}

 updatelesson(
    chIndex,
    lesIndex,
    "progress",
    percent
  );


  }
}
  )
     


const data = res.data;


if(data.success){
    updatelesson(
    chIndex,
    lesIndex,
    "videoKey",
    data.key
  );

  updatelesson(
    chIndex,
    lesIndex,
    "uploading",
    false
  );

   updatelesson(
    chIndex,
    lesIndex,
    "progress",
    100
  );

  updatelesson(
  chIndex,
  lesIndex,
  "processing",
  false
);


  toast.success("اپلود موفقیت  امیز بود ")



}else{
  toast.error(data.message)
    updatelesson(
    chIndex,
    lesIndex,
    "uploading",
    false
  );
}


  


  }catch(error){

      console.error(err);

    updatelesson(
        chIndex,
        lesIndex,
        "uploading",
        false
    );

    toast.error("خطا در حذف ویدیو قبلی");

    return;

  }

};

//این تابع برای اضافه کردن درسها وفصل ها است 
const updateChapterTitle=(index, title, value)=>{

setchapters((prevstate)=>prevstate.map((chapter,i)=>i===index?
{...chapter,[title]:value}:chapter

))
}

//1 تابع برای هندل کردن مقادیر انیپوتها 
const handlerChangeValueInput=(e)=>{
const {value,name,checked,type}=e.target
setFormdata((prevState)=>(
{...prevState,
[name]:type==="checkbox"?checked:value
}
))
}

//2 تابع برای نمایش عکس وقرار دادنمسیر عکس برای مونگو دی بی
const handlerEditImage=(e)=>{
  const fileIMage=e.target.files[0]
if(fileIMage){
  setThumbnail(fileIMage)
  setThumbnailPreview(URL.createObjectURL(fileIMage))
}
}

//تابع برای اضافه کردن درسها 
const addlesson = (chapterIndex,e) => {
  setchapters((prevstate) =>
    prevstate.map((ch, i) =>
      i === chapterIndex
        ? {
            ...ch,
            lessons: [
              ...ch.lessons,
              { title: "", duration: "", isfree: false, videoKey: "", uploading: false,progress: 0,processing: false, }
            ]
          }
        : ch
    )
  );
};

//این تابع رای حذف کردن هر درس در هر فلصل است 
const removelesson=(chapterINdex,lessonINdex)=>{
setchapters((prevsatate)=>prevsatate.map((ch,i)=>i===chapterINdex ?
 {...ch,lessons:ch.lessons.filter((lesson,i)=>i!==lessonINdex)}:ch))
}

//این تابع برای اضافه مردن فصل جدید است 
const addchapter = () => {

  setchapters((prev)=>{

    const newChapters = [
      ...prev,
      {
        title:"",
        lessons:[
          {
            title:"",
            duration:"",
            isfree:false,
            videoKey:"",
             uploading: false,
             progress: 0,
             processing: false,
          }
        ]
      }
    ];

    setOpenChapters(newChapters.length - 1);

    return newChapters;

  });

};
//این تابع برای حذف کردن فصل است 
const removechapter=(index)=>{
  if(chapters.length>1){
    setchapters((prevstate)=>prevstate.filter((chapter,indexchapter)=>indexchapter!==index))
  }
}
// بررسی این که اپلود به پایان رسیده یا نه 
const isUploading = chapters.some((chapter) =>
  chapter.lessons.some((lesson) => lesson.uploading)
);




  return(
    <>
    
    <div className={styles.container}>
      <div className={styles.header}>

 <h1 className={styles.title}>🎯 افزودن دوره جدید</h1>
 <p className={styles.subtitle}>
 تمام اطلاعات مورد نیاز برای ایجاد یک دوره حرفه‌ای را وارد کنید
 </p>

      </div>
      <form className={styles.form}>
<div className={styles.row}>
<div className={styles.field}>
 <label className={styles.label}>
 عنوان دوره <span className={styles.required}>*</span>
 </label>
 <input
type="text"
name="title"
className={styles.input}
onChange={handlerChangeValueInput}
value={formdata.title}
/>
</div>
<div className={styles.field}>
 <label className={styles.label}>
 اسلاگ
 </label>
 <input

type="text"
name="slug"
className={styles.input}
onChange={handlerChangeValueInput}
value={formdata.slug}
/>
</div>
</div>

<div className={styles.field}>
<label className={styles.label}>توضیحات کوتاه</label>
<textarea
value={formdata.shortDescription}
name="shortDescription"
className={styles.textarea}
onChange={handlerChangeValueInput}
/>
</div>

<div className={styles.field}>
<label className={styles.label}>توضیحات کامل</label>
<textarea
name="fullDescription"
value={formdata.fullDescription}
className={styles.textarea}
onChange={handlerChangeValueInput}
/>
</div>

<div className={styles.row}>
<input
type="number"
name="price"
placeholder="قیمت"
className={styles.input}
value={formdata.price}
onChange={handlerChangeValueInput}
/>

<input
type="number"
value={formdata.discountPrice}
name="discountPrice"
placeholder="قیمت تخفیف"
className={styles.input}
onChange={handlerChangeValueInput}
/>
</div>

<div className={styles.field}>
<label className={styles.label}>تصویر دوره</label>

<div className={styles.imageUpload}>
<label className={styles.uploadPlaceholder}>
<p>برای آپلود تصویر کلیک کنید</p>
<input
type="file"
accept="image/*"
className={styles.fileInput}
onChange={handlerEditImage}
/>
</label>
</div>


 {thumbnailPreview && (
<div className={styles.prewiwimage}>
<Image src={thumbnailPreview} alt="preview" width={300} height={200}/>
</div>
)}



{/* //فصل ها ودرسها // */}

<section className={styles.chaptersection}>
  <h2>فصل‌ها و درس‌ها</h2>

  <div className={styles.according}>

    {chapters.map((chapter, chIndex) => (

      <article
        key={chIndex}
        className={`${styles.chapteritem} ${openChapters === chIndex ? styles.open : ""}`}
      >

        <header className={styles.chapterheader}>

          <div className={styles.chaptertitlewrapper}>
            <span className={styles.chapterindex}>
              {chIndex + 1} فصل
            </span>

            <input
              type="text"
              placeholder="عنوان فصل"
              className={styles.chaptertitleinput}
              onClick={(e) => e.stopPropagation() }
              value={chapter.title}
            onChange={(e)=>updateChapterTitle(chIndex,"title",e.target.value)}
             
            />
          </div>

          <div className={styles.chaptersaction}>
            <span className={styles.lessoncount}>
              {chapter.lessons.length} درس
            </span>

            {chIndex > 0 && (
              <button
              type="button"
                onClick={() => removechapter(chIndex)}
                className={styles.removeseason}
              >
                حذف فصل
              </button>
            )}

            <span
              onClick={() =>
                setOpenChapters(openChapters === chIndex ? null : chIndex)
              }
              className={styles.arrow}
            >
              {openChapters === chIndex ? "▲" : "▼"}
            </span>
          </div>

        </header>

        {openChapters === chIndex && (

          <section className={styles.chapterscontent}>

            {chapter.lessons.map((lesson, lesIndex) => (

              <article key={lesIndex} className={styles.lessonitem}>

                <div className={styles.rowone}>

                  <input
                  value={lesson.title}
                    type="text"
                    placeholder="عنوان درس"
                    className={styles.lessontitle}
                    onChange={(e)=>updatelesson(chIndex,lesIndex,"title",e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="مدت زمان"
                    className={styles.lessonduration}
                    value={lesson.duration}
                      onChange={(e)=>updatelesson(chIndex,lesIndex,"duration",e.target.value)}
                  />

                  <label className={styles.lessonfreelabal}>
                    <input
type="checkbox"
checked={lesson.isfree}
onChange={(e)=>
updatelesson(
chIndex,
lesIndex,
"isfree",
e.target.checked
)}
/>
                    <span>رایگان</span>
                  </label>

                </div>

<input
  type="file"
  accept="video/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!formdata.slug.trim()) {
      toast.error("ابتدا اسلاگ دوره را وارد کنید");
      e.target.value = ""; // پاک کردن فایل انتخاب شده
      return;
    }

    if (!chapter.title.trim()) {
      toast.error("ابتدا عنوان فصل را وارد کنید");
      e.target.value = ""; // پاک کردن فایل انتخاب شده
      return;
    }

    handleVideoUpload(
      file,
      chIndex,
      lesIndex,
      formdata.slug,
      chapter.title
    );
  }}
  className={styles.lessonvideourl}
/>

    {/* // برای نمایش درصد اپلود    */}
<UploadProgress
uploading={lesson.uploading}
    processing={lesson.processing}
    progress={lesson.progress}
    success={!lesson.uploading && lesson.videoKey}
/>
                
                {chapter.lessons.length > 1 && (
                  <button
                  type="button"
                    onClick={() => removelesson(chIndex, lesIndex)}
                    className={styles.removeseason}
                  >
                    حذف درس
                  </button>
                )}

              </article>

            ))}

            <button
              onClick={() => addlesson(chIndex)}
              type="button"
              className={styles.addlessonbtn}
            >
              اضافه کردن درس جدید
            </button>

          </section>

        )}

      </article>

    ))}


 <button onClick={addchapter}  type="button" className={styles.addchapterbtn}>
 اضافه کردن فصل جدید +
 </button>



  </div>
</section>









</div>


 <div className={styles.actions}>
 <button
type="button"
onClick={handlersaveformdata}
className={styles.submitBtn}
 disabled={loading || isUploading}
>

{loading ? (<Loader/> ):isUploading?("در حال اپلود ویدیو"):("افزودن دوره")}

</button>

</div>


      </form>
    </div>
    
    </>
  )
}