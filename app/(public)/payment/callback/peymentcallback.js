"use client"
export const dynamic = "force-dynamic";
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/authcontext/authcontext"
import { useCart } from "@/context/cartContext/CartContext"
import styles from "./page.module.css"
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";


export default function PaymentCallback(){
const router=useRouter()
const {userRefresh}=useAuth()
const{clearCart}=useCart()
const searchParams=useSearchParams()
const [loading,setLoading]=useState(true)
const [result,setResult]=useState({
success:false,
message:"",
refId:""
})


// این یوز افکت برای اهتبار سنجیی کد اتوریزی و استاتوس است که از درگاه برداخت امده است 
useEffect(()=>{
const verifyPeyment=async()=>{
const authority = searchParams.get("Authority");
const status = searchParams.get("Status");


if(!authority || !status ){
    setLoading(false)
    return setResult({
        success:false,
        message:"خطا در ثبت سفارش "
    })
}


 try{
const res=await fetch("/api/cart/payment/verify",{
method:"POST",
headers:{"Content-Type": "application/json",},
body:JSON.stringify({
authority,
status
})
})
const data=await res.json()

console.log(data)
setLoading(false)

setResult({
    success:data.success,
    message:data.message,
    refId:data.refId
})


if(data.success){
    await userRefresh()
    clearCart()
}
   
    }
    catch(error){
setLoading(false)
setResult({
    success:false,
    message:"خطادر ارتباط با سرور"
})
    }
}
verifyPeyment()
},[searchParams])


if(loading){
    return(
<div className={styles.loadingContainer}>
  <div className={styles.loadingCard}>
    <h2>در حال بررسی پرداخت...</h2>
    <p>لطفاً چند لحظه صبر کنید.</p>
  </div>
</div>

    )
}


// برداخت موفق این باشد
if (result.success) {
  return (
    <div className={styles.container}>
      <div className={styles.successCard}>

        <div className={styles.successIcon}>
          <FaCircleCheck/>
        </div>

        <h2 className={styles.title}>
          پرداخت با موفقیت انجام شد
        </h2>

        <p className={styles.message}>
          {result.message}
        </p>

        <div className={styles.refBox}>

          <span className={styles.refTitle}>
            شماره پیگیری
          </span>

          <strong className={styles.refId}>
            {result.refId}
          </strong>

        </div>

        <button
          className={styles.primaryBtn}
          onClick={() => router.push("/profile/")}
        >
          مشاهده دوره‌های من
        </button>

      </div>
    </div>
  );
}




    return(
        <>
        <div className={styles.container}>
    <div className={styles.failedCard}>

      <div className={styles.errorIcon}>
        <FaCircleXmark/>
      </div>

      <h2 className={styles.title}>
        پرداخت ناموفق بود
      </h2>

      <p className={styles.message}>
        {result.message}
      </p>

      <button
        className={styles.secondaryBtn}
        onClick={() => router.push("/cart")}
      >
        بازگشت به سبد خرید
      </button>

    </div>
  </div>

        
        </>
    )
}