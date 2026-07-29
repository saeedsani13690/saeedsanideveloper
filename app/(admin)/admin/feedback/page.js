"use client"

import { useEffect, useState } from "react"
import { Container,Spinner } from "react-bootstrap"
import toast from "react-hot-toast"
import styles from "./page.module.css"
import { FaStar, FaRegStar } from "react-icons/fa";
import Swal from "sweetalert2";






export default function Feedback(){
const[loading,setLoading]=useState(true)
const[feedbackUser,setFeedbackUser]=useState([])
const [showModal,setShowModal]=useState(false)
const [selectedFeedback,setSelectedFeedback]=useState(null)

// این تابع برای گرفتن نظرات با امتیاز به سایت است 
const getFeedBackUsers=async()=>{
try{
  
const response=await fetch("/api/admin/feedback")
const data=await response.json()
 if (!response.ok) { toast.error(data.message); return; }
  setFeedbackUser(data)     
}
catch(error){
  console.error(error);
      toast.error("خطا در دریافت اطلاعات");
}finally{setLoading(false)}

}

useEffect(()=>{
getFeedBackUsers()
},[])


if (loading) {
  return (
    <Container className={styles.loadingContainer}>
      <div className={styles.loadingCard}>
        <Spinner animation="border" variant="primary" />

        <h4>در حال دریافت پیام‌ها...</h4>

        <p>لطفاً چند لحظه صبر کنید.</p>
      </div>
    </Container>
  );
}


// این تابع برای ین است که فیدبک کاربر خوانده شده یا نه 
const openModal=async(feedback)=>{
setSelectedFeedback(feedback)
setShowModal(true)
if(feedback.status==="approved") return ;
try{
const response=await fetch(`/api/admin/feedback/${feedback._id}`,{
  method:"PATCH"
})
const data=await response.json()
if (!response.ok) throw new Error(data.message);
setFeedbackUser((prev) =>
  prev.map((item) =>
    item._id === feedback._id
      ? { ...item, status: "approved" }
      : item
  )
);
setSelectedFeedback((prev)=>({...prev,status:"approved"}))
}

catch(error){
toast.error(error)
}

}

// این تابع برای باک کردن یک فید بک است 
const deleteFeedback=async(id)=>{
  const result = await Swal.fire({
      title: "حذف پیام",
      text: "آیا از حذف این پیام مطمئن هستید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
      confirmButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) return;
try{
const response=await fetch(`/api/admin/feedback/${id}`,{method:"DELETE"})
const data=await response.json()
if (!response.ok) throw new Error(data.message);
setFeedbackUser((prev)=>prev.filter((feed)=>feed._id!==id))
toast.success("بیام با موفقیت حذف شذ ")

}
catch(error){toast.error(error.message);}
}






    return(
        <>
    <Container  className="mt-4">
<h3 className="mb-4" >مدیریت بازخوردها</h3>
<div className={styles.tableWrapper}>
  <div className={styles.tableHeader}>
    <div>ردیف</div>
    <div>کاربر</div>
    <div>امتیاز</div>
    <div>پیام</div>
    <div>تاریخ</div>
    <div>وضعیت</div>
    <div>عملیات</div>
  </div>

  {feedbackUser.map((item, index) => (
    <div className={styles.tableRow} key={item._id}>
      <div>{index + 1}</div>

      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {item.name?.charAt(0)}
        </div>

        <div>
          <h6>{item.name}</h6>
          <span>{item.email}</span>
        </div>
      </div>

      <div className={styles.rating}>
  {[1, 2, 3, 4, 5].map((star) =>
    star <= item.rating ? (
      <FaStar key={star} className={styles.starActive} />
    ) : (
      <FaRegStar key={star} className={styles.starInactive} />
    )
  )}
</div>

      <div className={styles.message}>
        {item.message.length>120?item.message.slice(0,120)+"...":item.message}
      </div>

      <div>
        {new Date(item.createdAt).toLocaleDateString("fa-IR")}
      </div>

      <div>
       <span
  className={`${styles.status} ${
    item.status === "approved"
      ? styles.approved
      : item.status === "pending"
      ? styles.pending
      : styles.rejected
  }`}
>
  {item.status === "approved" ? " دریافت شد ": "در انتظار"}
   
    
    
   
</span>
      </div>
      <div className={styles.actions}>
<button   className={styles.view}
  onClick={() => openModal(item)}> 
  مشاهده
</button>
        <button
        onClick={()=>deleteFeedback(item._id)}
        >حذف</button>
      </div>
    </div>
  ))}
</div>
    </Container>

    {showModal && (

<div  className={styles.overlay} onClick={() => setShowModal(false)}>
<div  className={styles.modal}  onClick={(e) => e.stopPropagation()}>
<button
        className={styles.closeBtn}
        onClick={() => setShowModal(false)}
      >
        ✕
      </button>
      <h3>جزئیات پیام</h3>
   <div className={styles.messageBox}>{selectedFeedback?.message}  </div>   
</div>
</div>



    )}






        </>
    )
}