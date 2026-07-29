"use client"
import { Container, Row, Col } from "react-bootstrap";
import styles from "./ContactForm.module.css";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineSubject } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../shered/Loader";

export default function ContactForm() {


const [formData,setFormData]=useState({
name: "",
  email: "",
  subject: "",
  message: "",})
  const [loading,setLoading]=useState(false)


  // این تابع در واقع با تغییرات انیبوت مقادیر داخل استیت ذخیره میکند 
const handlerchangeForm=(e)=>{
  const{name,value}=e.target;
  setFormData((prev)=>(
{...prev,[name]:value}

  ))
}

// این تابع ارسال میکند این مقادیر رو 
const handelSumbitForm=async(e)=>{
 e.preventDefault();

if(!formData.name.trim()) return toast.error("نام الزامی است ")
  if(!formData.email.trim()) return toast.error("ایمیل الزامی است ")
      if (!formData.subject.trim()) return toast.error("موضوع را وارد کنید");
   if (!formData.message.trim()) return toast.error("پیام را وارد کنید"); 
    
try{
  setLoading(true)
const response=await fetch("/api/contact",{
  method:"POST",
  headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(formData)
})
const data=await response.json()

if(!response.ok) throw new Error(data.message)
  toast.success(data.message)
  setFormData({ name: "",  email: "", subject: "", message: "",});
}
catch(error){
 toast.error(error.message);
}finally{
  setLoading(false)
}

}





  return (
    <section className={styles.section}>
      <Container>

        <div className={styles.titleBox}>
          <h2>ارسال پیام</h2>
          <p>
            اگر سوال، پیشنهاد یا مشکلی دارید از طریق فرم زیر با ما در ارتباط باشید.
          </p>
        </div>

        <form  onSubmit={handelSumbitForm}>
<div className={styles.formWrapper}>

          <Row>

            <Col lg={6}>
              <div className={styles.inputGroup}>
                <label>نام و نام خانوادگی</label>

<div className={styles.inputWrapper}>
<MdOutlinePerson className={styles.icon} />
  <input
  name="name"
   type="text"
    placeholder="نام خود را وارد کنید "
    value={formData.name}
    onChange={handlerchangeForm}
    
    />
</div>
              </div>
            </Col>

            <Col lg={6}>
              <div className={styles.inputGroup}>
                <label>ایمیل</label>
                <div className={styles.inputWrapper} >
 <MdOutlineEmail className={styles.icon} />
                <input
                 type="email"
                   placeholder="example@gmail.com"
                   name="email"
                   value={formData.email}
                 onChange={handlerchangeForm}
                   />
                </div>
               
              </div>
            </Col>

          </Row>

          <div className={styles.inputGroup}>
            <label>موضوع</label>

            <div className={styles.inputWrapper} >
 <MdOutlineSubject className={styles.icon} />
            <input
             placeholder="موضوع پیام را وارد کنید"
             type="text"
             name="subject"
  value={formData.subject}
  onChange={handlerchangeForm}
            />

            </div>
       
          </div>

          <div className={styles.inputGroup}>
            <label>پیام</label>

            <div className={styles.inputWrapper} >
   <MdOutlineMessage className={styles.icon} />
            <textarea
               placeholder="پیام خود را بنویسید..."
               name="message"
            rows={7}
  value={formData.message}
  onChange={handlerchangeForm}
             
             ></textarea>
            </div>
     
          </div>

          <button className={styles.submitBtn}>
             {loading?<Loader/>:"ارسال بیام"}
          </button>

        </div>


        </form>

        

      </Container>
    </section>
  );
}