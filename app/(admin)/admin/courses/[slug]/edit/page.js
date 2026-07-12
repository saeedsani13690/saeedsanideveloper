"use client";
import styles from "../../../courses/add/Addcourse.module.css"
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "@/app/components/shered/Loader";
import { useParams } from "next/navigation";

export default function EditCourse(){
  const { slug } = useParams();


  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openChapters, setOpenChapters] = useState(0);
  const [chapters, setchapters] = useState([]);

  const [formdata, setFormdata] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    discountPrice: "",
    isfree: false,
    levelPeriod: "beginner",
    statusPeriod: "draft",
    slug: "",
  });

  // دریافت اطلاعات دوره از سرور
  useEffect(() => {
    const getSingleCourse = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/courses/${slug}`);

        if (!response.ok) {
          throw new Error("دوره یافت نشد یا دسترسی ندارید");
        }

        const data = await response.json();
        // حل مشکل دریافت دیتا به صورت آرایه یا آبجکت تکی
        const course = Array.isArray(data.course) ? data.course[0] : data.course;
        
        if (course) {
          setFormdata({
            title: course.title || "",
            shortDescription: course.shortDescription || "",
            fullDescription: course.fullDescription || "",
            price: course.isfree ? "" : course.price || "",
            discountPrice: course.discountPrice || "",
            isfree: course.isfree || false,
            levelPeriod: course.levelPeriod || "beginner",
            statusPeriod: course.statusPeriod || "draft",
            slug: course.slug || "",
          });
          setThumbnailPreview(course.thumbnail || "");

          // مدیریت ساختار چپترها و گرفتن درس‌ها
          const loadedChapters = course.chapters || [];
          setchapters(loadedChapters);
        }

       
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getSingleCourse();
  }, [slug]);

  // ثبت و ذخیره ویرایش دوره
  const handletEditFormdata = async () => {
    if (!formdata.title.trim()) {
      return toast.error("عنوان الزامی است");
    }

    if (!formdata.slug.trim()) {
      return toast.error("slug ضروری است");
    }

    setLoading(true);
    const data = new FormData();

    data.append("title", formdata.title);
    data.append("slug", formdata.slug);
    data.append("shortDescription", formdata.shortDescription);
    data.append("fullDescription", formdata.fullDescription);
    data.append("discountPrice", formdata.discountPrice || "");
    data.append("price", formdata.price || 0);
    data.append("isfree", formdata.isfree);
    data.append("levelPeriod", formdata.levelPeriod);
    data.append("statusPeriod", formdata.statusPeriod);
    data.append("chapters", JSON.stringify(chapters));
    if (thumbnail)  data.append("thumbnail", thumbnail);
     
    

    

    try {
      // تغییر متد به PUT و آدرس به Endpoint ویرایش همان دوره
      const response = await fetch(`/api/admin/courses/${slug}`, {
        method: "PUT",
        body: data
      });

      const result = await response.json();

      if (result.success || response.ok) {
        toast.success("تغییرات دوره با موفقیت ذخیره شد");
      } else {
        toast.error(result.message || "خطا در بروزرسانی");
      }
    } catch (error) {
      toast.error("خطا در ارسال اطلاعات",error);
    } finally {
      setLoading(false);
    }
  };

  // آپدیت کردن فیلدهای هر درس
  const updatelesson = (chindex, lessindex, field, value) => {
    setchapters((prev) =>
      prev.map((chapter, i) =>
        i === chindex
          ? {
              ...chapter,
              lessons: chapter.lessons.map((lesson, j) =>
                j === lessindex ? { ...lesson, [field]: value } : lesson
              ),
            }
          : chapter
      )
    );
  };

  // آپدیت عنوان فصل
  const updateChapterTitle = (index, title, value) => {
    setchapters((prevstate) =>
      prevstate.map((chapter, i) =>
        i === index ? { ...chapter, [title]: value } : chapter
      )
    );
  };

  // تغییر مقادیر فرم
  const handlerChangeValueInput = (e) => {
    const { value, name, checked, type } = e.target;
    setFormdata((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // انتخاب عکس جدید
  const handlerEditImage = (e) => {
    const fileIMage = e.target.files[0];
    if (fileIMage) {
      setThumbnail(fileIMage);
      setThumbnailPreview(URL.createObjectURL(fileIMage));
    }
  };

  // اضافه کردن درس جدید به فصل
  const addlesson = (chapterIndex) => {
    setchapters((prevstate) =>
      prevstate.map((ch, i) =>
        i === chapterIndex
          ? {
              ...ch,
              lessons: [
                ...ch.lessons,
                { title: "", duration: "", isfree: false, videoUrl: "" }
              ]
            }
          : ch
      )
    );
  };

  // حذف درس
  const removelesson = (chapterIndex, lessonIndex) => {
    setchapters((prevstate) =>
      prevstate.map((ch, i) =>
        i === chapterIndex
          ? { ...ch, lessons: ch.lessons.filter((_, j) => j !== lessonIndex) }
          : ch
      )
    );
  };

  // اضافه کردن فصل جدید
  const addchapter = () => {
    setchapters((prevstate) => [
      ...prevstate,
      { title: "", lessons: [{ title: "", duration: "", isfree: false, videoUrl: "" }] }
    ]);
  };

  // حذف فصل
  const removechapter = (index) => {
    if (chapters.length > 1) {
      setchapters((prevstate) =>
        prevstate.filter((_, indexchapter) => indexchapter !== index)
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎯 تغییرات در دوره </h1>
      </div>
      
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              عنوان دوره <span className={styles.required}>*</span>
            </label>
            <input
              value={formdata.title}
              type="text"
              name="title"
              className={styles.input}
              onChange={handlerChangeValueInput}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>اسلاگ</label>
            <input
              value={formdata.slug}
              type="text"
              name="slug"
              className={styles.input}
              onChange={handlerChangeValueInput}
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
            value={formdata.price}
            type="number"
            name="price"
            placeholder="قیمت"
            className={styles.input}
            disabled={formdata.isfree}
            onChange={handlerChangeValueInput}
          />

          <input
            value={formdata.discountPrice}
            type="number"
            name="discountPrice"
            placeholder="قیمت تخفیف"
             disabled={formdata.isfree}
            className={styles.input}
            onChange={handlerChangeValueInput}
          />
        </div>
<div className={styles.field}>
  <label className={styles.checkboxLabel}>
    <input
      type="checkbox"
      name="isfree"
      checked={formdata.isfree}
      onChange={handlerChangeValueInput}
    />
    دوره رایگان است
  </label>
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
        </div>

        {/* فصل‌ها و درس‌ها */}
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
                      فصل {chIndex + 1}
                    </span>
                    <input
                      value={chapter.title || ""}
                      type="text"
                      placeholder="عنوان فصل"
                      className={styles.chaptertitleinput}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateChapterTitle(chIndex, "title", e.target.value)}
                    />
                  </div>

                  <div className={styles.chaptersaction}>
                    <span className={styles.lessoncount}>
                      {chapter.lessons?.length || 0} درس
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
                    {chapter.lessons?.map((lesson, lesIndex) => (
                      <article key={lesIndex} className={styles.lessonitem}>
                        <div className={styles.rowone}>
                          <input
                            type="text"
                            placeholder="عنوان درس"
                            value={lesson.title || ""}
                            className={styles.lessontitle}
                            onChange={(e) => updatelesson(chIndex, lesIndex, "title", e.target.value)}
                          />

                          <input
                            type="text"
                            placeholder="مدت زمان"
                            value={lesson.duration || ""}
                            className={styles.lessonduration}
                            onChange={(e) => updatelesson(chIndex, lesIndex, "duration", e.target.value)}
                          />

                          <label className={styles.lessonfreelabal}>
                            <input
                              type="checkbox"
                              checked={!!lesson.isfree}
                              onChange={(e) => updatelesson(chIndex, lesIndex, "isfree", e.target.checked)}
                            />
                            <span>رایگان</span>
                          </label>
                        </div>

                        <input
                          type="text"
                          placeholder="آدرس ویدیو"
                          value={lesson.videoUrl || ""}
                          onChange={(e) => updatelesson(chIndex, lesIndex, "videoUrl", e.target.value)}
                          className={styles.lessonvideourl}
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

            <button onClick={addchapter} type="button" className={styles.addchapterbtn}>
              اضافه کردن فصل جدید +
            </button>
          </div>
        </section>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handletEditFormdata}
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? <Loader/> : "ثبت تغییرات دوره"}
          </button>
        </div>
      </form>
    </div>
  );
}
