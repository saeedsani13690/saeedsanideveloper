
// برای گرفتن یک فایل از ابراوران
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import getCurrentUser from "@/utils/getCurrentUser"

// لینک موقت میده 
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// برای اتصال به ابراوران 
import s3 from "@/configs/ArvanCloud";

import CourseSchema from "@/models/CourseSchema";


export async function POST(req){
try{
    // فرانت میگه: “این درس رو میخوام ببینم”
const {lessonId }=await req.json()
// ررسی می‌کنه این درخواست از کی اومده (login هست یا نه)

// برای اتعتبار سنجی کاربر یا ادمین 
const user = await getCurrentUser();


if (!user) {
  return NextResponse.json({ success: false, message: "کاربر مورد نظر پیدا نشد " });
}

const course=await CourseSchema.findOne({
  "chapters.lessons._id": lessonId,
})

if (!course) {
  return NextResponse.json({ success: false, message: "دوره پیدا نشد  " });
}

//چک کردن خرید توسط کاربر 
 const isPurchased=user.role==="admin" || user.purchesedCourses?.some((id)=>id.toString()=== course._id.toString())
 
if (!isPurchased) {
  return NextResponse.json({
    success: false,
    message: "برای مشاهده باید دوره را خریداری کنید",
  });
}

// حالا اون درس رو میخوایم پیدا کنیم 
let lesson;
course.chapters.forEach((ch)=>ch.lessons.forEach(les=>{if(les._id.toString()===lessonId){lesson=les}}))
if (!lesson?.videoKey) {
  return NextResponse.json({ success: false, message: "No video" });
}

//  در واقع اون فایل رو برمیمیگرونهساخت لینک امن برای کاربر


const command=new GetObjectCommand({
 Bucket: process.env.ARVAN_BUCKET,
 Key:lesson.videoKey
})



// این لینک فقط 5 دقیقه کار می‌کنه
const url=await getSignedUrl(s3,command,{expiresIn:60*5})


return NextResponse.json({
  success: true,
  url,
});


}



catch(error){
 console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });
}


}