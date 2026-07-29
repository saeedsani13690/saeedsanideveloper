"use client"
import { Container } from "react-bootstrap";
import styles from "./FeedbackForm.module.css";
import { FaStar } from "react-icons/fa6";
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../shered/Loader";

export default function FeedbackForm() {
const[loading,setLoading]=useState(false)
const [rating,setRating]=useState(0)
const[hoverstar,setHoverStar]=useState(0)
const[formData,setFormData]=useState({
name:"",
email:"",
message:""
})
// برای تغییرات اینچوتها است 
const handleronchangeform=(e)=>{
  const{name,value}=e.target

  setFormData((prev)=>({
...prev,
[name]:value

  }))

}

// برای فرستادن اطلاعات به دیتا بیس
const handlerSubmit=async(e)=>{
  e.preventDefault();
 if (!rating) {
    toast.error("لطفاً امتیاز خود را انتخاب کنید.");
    return;
  }
  if (!formData.message.trim()) {
    toast.error("لطفاً نظر خود را وارد کنید.");
    return;
  }

if (
  formData.email &&
  !/^\S+@\S+\.\S+$/.test(formData.email)
) {
  toast.error("ایمیل معتبر نیست.");
  return;
}


try{
  setLoading(true)
const response=await fetch("/api/contact/feedback",
  {method:"POST",
     headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({...formData,rating})
  })
const data=await response.json()

if (!response.ok) {
  toast.error(data.message);
  return;
}

  toast.success(data.message)
  setRating(0);
   setFormData({
      name: "",
      email: "",
      message: "",
    });
}
catch(error){
 console.error(error);
  toast.error("خطایی در ارتباط با سرور رخ داد.");
}finally{
setLoading(false)
}


}






  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.header}>
          <h2>پیشنهاد و انتقاد</h2>
          <p>نظرات شما به ما کمک می‌کند کیفیت سایت را بهتر کنیم.  </p>
        </div>


<form onSubmit={handlerSubmit}>
<div className={styles.card}>
          <div className={styles.stars}>
            {[1,2,3,4,5].map((star)=>(
<FaStar 
key={star}
className={star <= (hoverstar || rating) ? styles.activeStar : styles.star}
onClick={() => setRating(star)}
onMouseEnter={() => setHoverStar(star)}
      onMouseLeave={() => setHoverStar(0)}
/>
            ))}

          </div>

          <div className={styles.inputGroup}>
            <label>نام (اختیاری)</label>
            <input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleronchangeform}
/>
          </div>

          <div className={styles.inputGroup}>
            <label>ایمیل (اختیاری)</label>
            <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleronchangeform}
/>
          </div>

          <div className={styles.inputGroup}>
            <label>نظر شما</label>
           <textarea
  name="message"
  rows={6}
  value={formData.message}
  onChange={handleronchangeform}
/>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 
 ( <> <Loader />   در حال ارسال...</>)
 : ("ارسال نظر")}
          </button>

        </div>



</form>
        

      </Container>
    </section>
  );
}