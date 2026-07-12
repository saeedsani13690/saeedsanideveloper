"use client"
import { useState } from "react"
import styles from "./CourseIntruduction.module.css"
import Link from "next/link"
import { FaCheckCircle } from "react-icons/fa"
import { FaShoppingCart } from "react-icons/fa"
import { useCart } from "@/context/cartContext/CartContext"

import { useAuth } from "@/context/authcontext/authcontext"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"


export default function CourseInrudection(  {course,totalDuration,totalLessons,statusText,levelText})  {
  
const{cart,addToCart}=useCart()  
const {user}=useAuth()
const router=useRouter()
const[loading,setLoading]=useState(false)
//دوره رایگان است یا نه
const isfree=false;
//کاربر دوره را خریداری کرده یا نه 
const hasPurchased=user && user.purchesedCourses?.some(purchesedCourses=>purchesedCourses._id===course._id);

// برای اینکه یم محصول تخفیف داردیا نه
const hasDiscount=course.discountPrice? true : false;


// برای نمایش نهایی قیمت با تخفیف 
const finalPrice=hasDiscount?course.discountPrice:course.price;


// برای اینکه اگر ادمین بود نتونه به سبد خرید اضافه کند 
const isadmin=user && user.role==="admin"




//این کتغیر برای اینکه محصول به سد خرید اضافه شده یانه براساس کارت سبد خرید مشحص میکینم
const isCourseInCard = cart?.some(
  (item) => item._id === course._id
);


//بابت اعتبارسنجی کاربر برای لاگین بعد اجازه بدهیم محصول را به سبد خرید اضافه کند 
const addtocarthandler=(course)=>{
if(!user){
        toast.error("لطفا اول لاگین انجام شود ")
      return  router.push("/auth")   
}

if(user.role==="admin") return  toast.error("شما ادمین هستید ونیازی به خرید کالا نیست ")



addToCart(course)
toast.success("دوره به سبد اضافه شده است ")
}



    return(
        <>
        
    
<div className={styles.courseintru}>
  <div className={styles.courseinfo}>
    <h1 className={styles.coursetilte}>{course.title}</h1>
    <p className={styles.coursedecription}>
        {course.shortDescription || "توضیحات کوتاهی برای این دوره در دسترس نیست "}  
          </p>

  <div className={styles.coursepaymant}>
{hasPurchased?(
    <div className={styles.purchasedBox}>
        <FaCheckCircle fontSize={30} color="green"  />
<span>       شما دانشجوی دوره هستید </span>
<Link className={styles.learningbtn

} href={`/learn/${course.slug}`}>شروع یادگیری</Link>


</div>)



:
(<button onClick={()=>addtocarthandler(course)} disabled={loading} className={true?styles.freeintrolbtn:styles.inrolbtn}>
    <FaShoppingCart fontSize={30}/>
<span >
{loading?
"درحال پردازش "
:isfree?
"ثبت نام رایگان"
:isCourseInCard?
"به سبد خرید اضافه شده است "
:
hasPurchased?"شما دانشجوی دوره هستید "
:isadmin? "شما ادمین هستید "
:"ثبت نام در دوره"}

</span>
</button>)}


{/* اینجا قیمت وابسته به خریداری شدن دوره ورایگان بودن نمایش میدهد */}
{!isfree && !hasPurchased && (<div className={styles.priceBox}>
{hasDiscount && <del className={styles.orginalPrice}>



</del> }
<span>{finalPrice.toLocaleString()}</span>
<span>تومان</span>


</div>) }
   </div> 





    </div> 

  



<div className={styles.courseMeta}>
<MetaItem label="وضعیت دوره " value={statusText}      />
<MetaItem label=" سطح " value={levelText}      />
<MetaItem label=" مدت زمان " value={totalDuration}      />
<MetaItem label=" تعداد جلسات " value={totalLessons}      />
<MetaItem label=" روش پشتیبانی " value="تیکت و پرشس و پاسخ "      />
<MetaItem label=" پیش نیاز  " value="ندارد "     />




</div>






</div>



        </>
    )
}

function MetaItem({label,value}){
    return(
<div className={styles.courseDetailsBox}>
<p className={styles.label}><b>{label}</b></p>
<p className={styles.value}>{value}</p>

</div>


    )

}