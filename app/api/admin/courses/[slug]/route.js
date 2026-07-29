import connectDB from "@/configs/db";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";
import Course from "@/models/CourseSchema"
import path from "path";
import { mkdir, writeFile } from 'fs/promises'
import {
 DeleteObjectCommand,
 ListObjectsV2Command
} from "@aws-sdk/client-s3";
import s3 from "@/configs/ArvanCloud";
import CourseSchema from "@/models/CourseSchema";
import { getEmbedding } from "@/app/api/chatBot/openai";


// حذف کامل یک فولدر در آروان کلود
const deleteArvanFolder = async (prefix) => {

  let continuationToken = undefined;

  do {

    const result = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.ARVAN_BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken
      })
    );


    if (result.Contents && result.Contents.length > 0) {

      for (const file of result.Contents) {

        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.ARVAN_BUCKET,
            Key: file.Key
          })
        );

        console.log("Deleted:", file.Key);
      }

    }


    continuationToken = result.NextContinuationToken;


  } while (continuationToken);

};
















export async function GET(req,{params}) {
   try{
await connectDB()
const authisadmin=IsAdmin(req)
 if(!authisadmin.isAdmin){
    return authisadmin
 }

 //slug chekk
 const {slug}=await params
if(!slug){
    return Response.json(
{success:false,message:"اسلاگ ضروری است "},
{status:400}

    )
}


//find copurse
const course=await Course.find({slug})
if(!course){
     return Response.json(
{success:false,message:"  دوره مورد نظر پیدا نشد  "},
{status:404}

    )
}
  return Response.json(
{success:true,course},
{status:200}

    )



   }
   
   
   catch(error){
  return Response.json(
{success:false,message:"      خطای سرور حوشگلم   "},
{status:500}

    )
   } 
}


export async function DELETE(req,{params}) {
   try{
await connectDB()
const authisadmin=IsAdmin(req)
 if(!authisadmin.isAdmin){
    return authisadmin
 }

 

 //slug chekk
 const {slug}=await params
if(!slug){
    return Response.json(
{success:false,message:"اسلاگ ضروری است "},
{status:400}

    )
}






//find copurse
const course=await CourseSchema.findOne({slug})
  if (!course) {
      return Response.json(
        { success: false, message: "دوره پیدا نشد" },
        { status: 404 }
      );
    }

    

  await deleteArvanFolder(`${slug}/`);
// حذف خود دوره 
 await CourseSchema.deleteOne({slug})



  return Response.json(
{success:true,message:"دوره مورد نظر پاک شد "},
{status:200}

    )



   }
   
   
   catch(error){
  return Response.json(
{success:false,message:"      خطای سرور حوشگلم   "},
{status:500}

    )
   } 
}







export async function PUT(req, { params }) {
 try{
await connectDB()



const authisadmin=IsAdmin(req)
 if(!authisadmin.isAdmin){
    return authisadmin 
 }




 const {slug:urlSlug}=await   params
if(!urlSlug){
    return Response.json(
{success:false,message:"اسلاگ معتبر نیست "},
{status:400}
    )
}





const course=await Course.findOne({slug:urlSlug}) 
if(!course) return Response.json({message:"دوره یافت نشد"},{status:404})




const formData=await req.formData()
if(!formData){
    return NextResponse.json(
{success:false,message:"هیچ فرمی وارد نکردی "}


    )
}


//pars formdata
const title=formData.get("title");
const updateSlug=formData.get("slug");
const shortDescription=formData.get("shortDescription");
const price=formData.get("price");
const discountPrice=formData.get("discountPrice");
const isfree=formData.get("isfree")=== "true";
const levelPeriod=formData.get("levelPeriod") || "beginner";
const statusPeriod=formData.get("statusPeriod") || "draft";
const fullDescription=formData.get("fullDescription");
const thumbnail=formData.get("thumbnail"); //ادرس فایل عکس
const chaptersJSon=formData.get("chapters");


//simple validation form
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

//validate chapters
let chapters=[]
if(chaptersJSon){
try{
 chapters=JSON.parse(chaptersJSon.toString())
 if(!Array.isArray(chapters) || chapters.length===0){
return Response.json(
    {success:false,message:"حداقل یک فصل لازم است "},
    {status:400}
)}

for(const chapter of chapters){
if(!chapter.title?.trim()){
  return Response.json(
    {success:false,message:"    عنوان فصل الزامی است  "},
    {status:400}
)  
}

if(!Array.isArray(chapter.lessons) || chapter.lessons.length===0   ){
 return Response.json(
    {success:false,message:"        هر فصل حداقل یک درس نیاز دارد  "},
    {status:400}
) 
}

for(const less of chapter.lessons){

if(!less.title?.trim()){
 return Response.json(
    {success:false,message:" عنوان هر درس الزامی است "},
    {status:400}
) } 
if(!less.duration?.trim()){
   return Response.json(
    {success:false,message:" مدت زمان هر درس لازم است "},
    {status:400}
)  
}

}
}

}
catch(error){
  return Response.json(
    {success:false,message:" فرمت درسها و فصلها نامعتبر است  "},
    {status:400}
) 

}
}

//چک کردن اسلاگ برای یونیک بودن 

if(updateSlug!==urlSlug){
   const exitingSlug=await Course.findOne({slug:urlSlug}) 
   if(exitingSlug){
    return Response.json(
{success:false,message:"این اسلاگ قبلا انتخاب شده است "},
{status:400}

    )
   }
}


//قرار دادن عکس جدید 
let imageUrl=course.thumbnail
if(thumbnail && thumbnail instanceof File){
 
 const bytes= await thumbnail.arrayBuffer()
 const buffer=Buffer.from(bytes)
 const filename=`${Date.now()}-${Math.round(Math.random()*1e9)} ${path.extname(thumbnail.name)}`;
 const uploadDir=path.join(process.cwd(),"public","images","courses")
 await  mkdir(uploadDir,{recursive:true});
 const filePath=path.join(uploadDir,filename);
  await writeFile(filePath,buffer);
  imageUrl=`/images/courses/${filename}`
}

//اپدیت دوره جدید 
course.title=title;
course.slug=updateSlug;
course.shortDescription=shortDescription;
course.fullDescription=fullDescription;
course.price=isfree?0:Number(price);
course.discountPrice=discountPrice?Number(discountPrice):null;
course.isfree=isfree;
course.levelPeriod=levelPeriod;
course.statusPeriod=statusPeriod;
course.thumbnail=imageUrl;
course.chapters=chapters;
 course.lessonsCount= chapters.reduce((sum,ch)=>sum+ch.lessons.length,0)

// ساخت embedding جدید بعد از تغییر اطلاعات دوره

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
course.embedding = embedding;


await course.save();
return Response.json(
{success:true,message:"دورهبا موفقیت اپدیت شد ",course}
)

 }
 
 
 
 
 catch(error){
return Response.json(
{success:false,message:error.message},
{status:500}
)

 }






}



export async function PATCH(req,{params}){
try{
await connectDB()


 const authisadmin = IsAdmin(req);
    if (!authisadmin.isAdmin) {
      return authisadmin;
    }


    const {slug}=await params
const course=await Course.findOne({slug})

if(!course){
    return Response.json(
        {success:false,message:"دوره پیدا نشد"},
        {status:404}
    )
}

course.statusPeriod=course.statusPeriod==="published"?"draft":"published"
await course.save();
 return Response.json({
      success: true,
      message:
        course.statusPeriod === "published"
          ? "دوره منتشر شد."
          : "دوره به پیش‌نویس منتقل شد.",
      statusPeriod: course.statusPeriod,
    });




}


catch(error){
  return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
}
}