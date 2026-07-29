"use client"

import OtpInputs from "@/app/components/features/auth/OtpInput";
import toast from "react-hot-toast";
import styles from "./auth.module.css"
import { useEffect, useState } from "react";
import {IoMdArrowRoundBack} from "react-icons/io"
import Loader from "@/app/components/shered/Loader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext/authcontext";
import Link from "next/link";
import { FiPhone } from "react-icons/fi";
import { TbBrandJavascript } from "react-icons/tb";
import { FiClock } from "react-icons/fi";

export default function AuthPage(){
  //اعتبار سنجی موبایل در فرانت
const isvalidPhone=(phone)=>/^09\d{9}$/.test(phone)
  const[phone,setPhone]=useState("")
  const[isCodeSent,setIsCodeSent]=useState(false)
  const[isloading,setIsLOading]=useState(false)
  const[otp,setOtp]=useState(["","","","",""])
  const[timer,setTimer]=useState(null)
  const router=useRouter()
  const { userRefresh } = useAuth();


//اتفاق افتادن اون زمان که بابت اعتبار کد برای کاربر نمایش میدهد
useEffect(()=>{
let interval;
if(isCodeSent && timer>0){
interval=setInterval(() => {
  setTimer(time=>time-1)
}, 1000);

}
return ()=>clearInterval(interval )
},[timer,isCodeSent])
// برای اینکه تلفن رو وارد کرده حالا بک زده یا کلا صفحه رو بسته 
useEffect(()=>{

if(!phone) return 
const checkOtpStatus=async ()=>{
  const res = await fetch(`/api/auth/sms/status?phone=${phone}`);
        const data = await res.json();
       



if(data.hasActiveOtp){
  toast.success("       نیازی به ارسال مجدد کد نیست، از کد قبلی استفاده کنید ")



  setTimeout(() => {
  setIsCodeSent(true);
  setTimer(data.remainingTime);
}, 2000);
  
}
}
checkOtpStatus();

},[phone])
//فرستادن کد مجدد واسه کاربر
const handelResendCOdeOtp= async()=>{

try{
const res=await fetch("/api/auth/sms/send",{
method:"POST",
headers:{"Content-type":"application/json"},
body:JSON.stringify({phone})
})
const data=await res.json()
if(data.success){
  
  toast.success("کد با موفقیت ارسال شد ")
  setOtp(["","","","",""])
    setTimer(data.remainingTime)
}
else{
  toast.error("کد شما هنوز دارای اعتبار است دقایقی دیگر امتحان کنید")
}

}
catch(error){
console.log(error)
}
}
//بررسی اینکه هیچ اینپوتی خالی نباشد که اجازه دهیم دکمه فعال شود
const iscompletedotp=otp.every(input=>input!=="")
// کلکیک برگشت به صفحه که شماره موبایل وارد میکینم
const handlergotoback=()=>{
  setIsCodeSent(false)
setTimer(null)
 setOtp(["","","","",""])
 
}
//اعتبارسنجی کد و فرستادن کاربر به صفحه اصلی یا داشبورد
const verifiedCode= async()=>{
  //چسباندن اعداد به هم 
const otpCode=otp.join("")
try{
  setIsLOading(true)
const res=await fetch("/api/auth/sms/verify",{
method:"POST",
headers:{"Content-type":"application/json"},
credentials:"include", // یعنی در کوکی قرار بگیره حتما بزار 
body:JSON.stringify({phone,otpCode})
})

const data= await res.json()
if(data.success){
  toast.success("با موفقیت وارد شدید ")
  await userRefresh();
if(data.user.role=="admin"){
  // window.location.href="/admin/dashboard"
  router.push("/admin/dashboard")
}else{
  //  window.location.href="/profile"
   router.push("/profile")
}

}
else{
if(res.status==401){
  toast.error(data.message)
}else if(res.status==410){
  toast.error(data.message)
}else{
  toast.error(data.message)
}



}



}


catch(error){
toast.error(error)
}finally{
  setIsLOading(false)
}
}

// فانکشن دکمه ارسال موبایل هست و برای دریافت کد پیامک
  const handlerCodeOPt= async()=>{
    setIsLOading(true)
try{
const res=await fetch("/api/auth/sms/send",{
method:"POST",
headers:{"Content-type":"application/json"},
body:JSON.stringify({phone})
})
const data=await res.json()

setIsCodeSent(true);
setTimer(data.remainingTime);


if(data.success){
toast.success(data.message);
}
else{
   toast.error(data.message);
}

}
catch(error){
console.log(error)
}
finally{
  setIsLOading(false)
}
  }





  return(
    <>
    
<div className={styles.auchWrapp}>
{/* {انیمشین پشت صحنه } */}
<div className={styles.particle} style={{ left: "10%",animationDelay:"6s" }} />
<div  className={styles.particle}style={{ left: "30%", animationDelay: "2s" }} />
 <div className={styles.particle} style={{ left: "60%", animationDelay: "4s" }} />
<div className={styles.particle} style={{ left: "80%", animationDelay: "1s" }}/>
         


 
{!isCodeSent && 
<div className={styles.authForm}>
<div className={styles.logoBox}>
        <span><TbBrandJavascript/></span>
    </div>

<h2>saeedDeveloper</h2>
<h3>ورود به حساب کاربری</h3>
<p>
شماره موبایل خود را وارد کنید تا کد تأیید برای شما ارسال شود.
</p>
<div className={styles.inputGroup}>

    <input
        type="tel"
        dir="rtl"
        inputMode="numeric"
        placeholder="09123456789"
        value={phone}
        onChange={(e)=>setPhone(e.target.value)}
    />
<FiPhone className={styles.inputIcon} />
</div>
<button
    onClick={handlerCodeOPt}
    disabled={!isvalidPhone(phone) || isloading}
>
    {isloading ? <Loader /> : "ارسال کد تأیید"}
</button>

<div className={styles.divider}>
    <span>یا</span>
</div>

<Link href="/" className={styles.homeLink}>
    بازگشت به صفحه اصلی
</Link>





</div>
 }






{
isCodeSent && 
<div className={styles.gotobackRegister}>
<button
    className={styles.backButton}
    onClick={handlergotoback}
>
    <IoMdArrowRoundBack />
</button>


<div className={styles.logoBox}>
    <span>
        <TbBrandJavascript />
    </span>
</div>



<p>
کد تأیید به شماره زیر ارسال شده است.
</p>
<div className={styles.phoneBadge}>
    {phone}
</div>


<h3>کد ۵ رقمی را وارد کنید</h3>
<OtpInputs otp={otp} setOtp={setOtp}/>
{isloading?(<Loader/>):(<button onClick={verifiedCode} disabled={!iscompletedotp}>تایید و ورود</button>)}

{timer > 0 ? (
    <div className={styles.timerBox}>
        <FiClock />
        <span>{timer} ثانیه</span>
    </div>
) : (
    <button
        onClick={handelResendCOdeOtp}
        className={styles.resendBtn}
    >
        ارسال مجدد کد
    </button>
)}






</div>
}
</div>

    </>
  )
}