"use client"
// import Typewriter from 'typewriter-effect'
import { useEffect, useState } from 'react'
// این متغیر برای نوشت و باک کردن اون نوشته است 
const PersianTypewriter=({text,speed=100})=>{
  // اول کار خالیاست 
const[displayText,setDisplayText]=useState("")
// این مشخص میکند الان در حال باک رکدن هستین یا نوشت ن
const [isDeleting,setIsDeleting]=useState(false)

useEffect(()=>{

let timeOut// برای نگه داشتن تایمر استفاده میسشوذ 

// اینجا یعنی هنور در حال نوشتم هستیم  ویکی یکی حروف اضافه میشه 
if(!isDeleting && displayText.length <text.length ){
  timeOut=setTimeout(() => {
    setDisplayText(text.slice(0,displayText.length+1))
  }, speed);

  // اگر حروف بر شد حالا میخوایم متغیر ور عوض کنیم تا بره باک کنه یکی کی 
}else if(!isDeleting && displayText.length===text.length){
  timeOut=setTimeout(() => {
    setIsDeleting(true)
  }, 1800);
}

// اینجا حالا میخوام یکی یکی باک کنیم 
else if(isDeleting && displayText.length>0){
timeOut=setTimeout(() => {
  setDisplayText(text.slice(0,displayText.length-1))
}, speed/2);
}
// حالا همه باک شده دوباره شروع کن از اول نوشتم 
else if (isDeleting && displayText.length===0){
setIsDeleting(false)
}
return () => clearTimeout(timeOut)

},[displayText,isDeleting,text,speed])

return (
  <span dir="rtl">
    {displayText}
  </span>
)
}


function Introduction() {


  return (
    <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50    w-full mt-5 py-10 sm:py-14 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-16">

          {/* Text */}
          <div className="w-full text-center lg:w-1/2 lg:text-right">


<div className="min-h-[1.2em] break-words text-2xl font-bold leading-tight text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
  <PersianTypewriter
    text="سلام، من"
    speed={120}
  />
</div>



<div className="min-h-[1.2em]   mt-2 break-words text-2xl font-bold leading-tight text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
  <PersianTypewriter
    text="سعید ثانی هستم..."
    speed={120}
  />
</div>




        

            <p className="mx-auto mt-6 max-w-2xl text-base font-bold leading-8 text-gray-600 sm:text-lg lg:mx-0 dark:text-gray-300">
              ! من یک برنامه‌نویس و طراح سایت هستم.
              در زمینه ساخت رابط‌های کاربری مدرن، جذاب و واکنش‌گرا
              با استفاده از تکنولوژی‌های روز وب فعالیت می‌کنم.
            </p>

            {/* Skills */}
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">

              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600 dark:bg-orange-900/30">
                HTML
              </span>

              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-600 dark:bg-blue-900/30">
                CSS
              </span>

              <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-600 dark:bg-yellow-900/30">
                JavaScript
              </span>

              <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-bold text-cyan-600 dark:bg-cyan-900/30">
                React
              </span>

              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-600 dark:bg-purple-900/30">
                Tailwind CSS
              </span>

            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="mx-auto h-64 w-64 overflow-hidden rounded-full border-4 border-pink-400 shadow-2xl sm:h-80 sm:w-80 lg:h-96 lg:w-96 dark:border-white">

              <img
                src="/assets/Copilot_20251115_100910.png"
                alt="سعید ثانی"
                className="h-full w-full rounded-full object-cover transition-transform duration-500 hover:scale-105"
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Introduction