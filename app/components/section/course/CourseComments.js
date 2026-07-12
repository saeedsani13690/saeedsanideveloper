"use client";

import { useState } from "react";
import styles from "./CourseComments.module.css"
import { useAuth } from "@/context/authcontext/authcontext";
import toast from "react-hot-toast";




export default function CourseCommentForm({ course }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(1);
  const{user}=useAuth()



// برای ثبت کامنت توسط کاربر
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return 

if(!user){
  return toast.error("لطفا اول لاگین کنید ")
}
    setLoading(true);
    try{
const response=await fetch("/api/comment",{
  method:"POST",
  headers:{ "Content-Type": "application/json"},
  body:JSON.stringify({
    body:text,
    courseId:course._id,
    score:score
  })
})
const data=await response.json()
if(response.status===409){
  toast.error(data.message)
}
if(data.success){
  toast.success("نظر شما ثبت شد ")
  setText("")
  setScore(1)
}
    }
    
    catch(error){
      toast.error(error)

    }finally{
 setLoading(false)
    }




    
    
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3 className={styles.title}>نظر خود را بنویسید</h3>
         <p className={styles.subtitle}>
          تجربه‌ات از این دوره می‌تونه به بقیه کمک کنه 👍
        </p>
{[1,2,3,4,5].map((star) => (
  <span
    key={star}
    onClick={() => setScore(star)}
    style={{
      cursor: "pointer",
      fontSize: "24px",
    }}
  >
    {star <= score ? "⭐" : "☆"}
  </span>
))}






        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="مثلاً: این دوره خیلی مفید بود چون..."
            className={styles.textarea}
          />

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className={styles.button}
          >
            {loading ? "در حال ارسال..." : "ثبت نظر"}
          </button>
        </form>
      </div>
    </div>
  );
}