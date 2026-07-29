
import connectDB from "@/configs/db";
import Course from "@/models/CourseSchema";
import { NextResponse } from "next/server";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";
import path from "path"
import { mkdir, writeFile } from 'fs/promises'
import { getEmbedding } from "@/app/api/chatBot/openai";

export async function POST(req) {
    try{

await connectDB()

const authisadmin=IsAdmin(req)

 if(!authisadmin.isAdmin){
    return authisadmin
 }




const formData=await req.formData()
if(!formData){
    return NextResponse.json(
{success:false,message:"هیچ فرمی وارد نکردی "}


    )
}


//pars formdata
const title=formData.get("title");
const slug=formData.get("slug");
const shortDescription=formData.get("shortDescription");
const price=formData.get("price");
const discountPrice=formData.get("discountPrice");
const isfree=formData.get("isfree")=== "true";
const levelPeriod=formData.get("levelPeriod") || "beginner";
const statusPeriod=formData.get("statusPeriod") || "draft";
const fullDescription=formData.get("fullDescription");
const thumbnail=formData.get("thumbnail"); //ادرس فایل عکس
const chaptersJSon=formData.get("chapters"); 

//validate chapters
let chapters=[]
if(chaptersJSon){
try{
chapters=JSON.parse(chaptersJSon.toString());



if(!Array.isArray(chapters) || chapters.length===0 ){
    return Response.json(
{message:"حداقل یک فصل لازم است "},
{status:400}
    )
}

for(const ch of chapters){
   if(!ch.title?.trim()) {
  return Response.json(
{message:" عنوان هر فصل الزامی است     "},
{status:400}
    )
   }

if(!Array.isArray(ch.lessons) || ch.lessons.length===0 ){
    return Response.json(
{message:"حداقل یک درس لازم است "},
{status:400}
    )
}


for(const les of ch.lessons ){
if(!les.title?.trim()){
       return Response.json(
{message:"    عنوان هر درس الزامی است  "},
{status:400}
    )
}
if(!les.duration?.trim()){
          return Response.json(
{message:"        مدت زمان لازم است   "},
{status:400}
    )
}

  if (!les.videoKey?.trim()) {
    return NextResponse.json(
      { message: "ویدیو هر درس الزامی است" },
      { status: 400 }
    );
  }
    
}



}
}
catch(error){
      return Response.json(
{message:"             فرمت درسها و فصل ها نامعبر است  "},
{status:500}
    )
}

}




// validation form data

if(!thumbnail || !(thumbnail instanceof File )){
   return NextResponse.json(
{success:false,message:"تصویر دوره الزامی است"},
{status:400}


   ) 
}


if(!title || title.length<5){
    return NextResponse.json(
{success:false,message:"عنوان دوره باید حداقل 5 کاراکتر باشد"},
{status:400})
}



if(!fullDescription || fullDescription.length<50){
    return NextResponse.json(
{success:false,message:"    توضیحات کامل باید حداقل 50 کاراکتر باشد   "},
{status:400})
}




if(!slug){
    return NextResponse.json(
{success:false,message:"        slugمعتبر وارد کنید      "},
{status:400})
}








const exitingSlug=await Course.findOne({slug})
if(exitingSlug){
      return NextResponse.json(
{success:false,message:"         slugدیگری انتخاب کنید        "},
{status:400})
}




const bytes = await thumbnail.arrayBuffer();
const buffer = Buffer.from(bytes);

// اصلاح شد: حذف فاصله اضافی قبل از پسوند فایل
const fileExtension = path.extname(thumbnail.name);
const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;

const uploadDir = path.join(process.cwd(), "public", "images", "courses");
await mkdir(uploadDir, { recursive: true });
const filePath = path.join(uploadDir, filename);
await writeFile(filePath, buffer);
const imgUrl = `/images/courses/${filename}`;



//برای مححاسبه زان کل دوره و اضافهکردن اون مشخصات به هر دوره
let totalMinutes = 0;
chapters.forEach((chapter)=>{
chapter.lessons.forEach((lesson)=>{
        const [minutes, seconds] = lesson.duration.split(":").map(Number)
totalMinutes+=minutes
 totalMinutes += seconds / 60;
})
})
const hours = Math.floor(totalMinutes / 60);
const minutes = Math.round(totalMinutes % 60);
const totalDuration = `${hours} ساعت و ${minutes} دقیقه`;



const courseText = `
نام دوره:
${title}
دسته بندی:
برنامه نویسی و طراحی سایت
توضیحات کوتاه:
${shortDescription}
توضیحات کامل:
${fullDescription}
سطح:
${levelPeriod}
سرفصل ها:
${chapters
.map(ch => ch.title)
.join(" ")}
`;
const embedding = await getEmbedding(courseText);








//   ذخیره کردن دوره 
  const newCourse=  new Course({
title,
slug,
shortDescription,
fullDescription,
price:isfree?0:Number(price),
discountPrice:discountPrice?Number(discountPrice):null,
isfree,
levelPeriod,
statusPeriod,
thumbnail:imgUrl,
chapters,
lessonsCount:chapters.reduce((sum,ch)=>sum+ch.lessons.length,0),
totalDuration,
embedding
  })

  await newCourse.save()
  return NextResponse.json(
{success:true,message:"دوره با موفقیت اضافه شد"},
{status:201}



  )



    }
    
    



    catch(error){
        console.log(error)
return NextResponse.json(
{success:false,message:error.message},
{status:500}


)
    }




}