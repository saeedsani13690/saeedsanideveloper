import connectDB from "@/configs/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import UserSchema from "@/models/UserSchema";
import CourseSchema from "@/models/CourseSchema";
import fs from "fs/promises";
import path from "path";


export async function GET(){
try{
await connectDB()

const cookieStore=await cookies()
 const accessToken=cookieStore.get("accessToken")?.value

//اکر رفرش توکن نباشد یعنی لاگین نکرده است 
 if(!accessToken){
return NextResponse.json(
{success:false,message:"لطفا لاگین فراموش نشود "},
{status:401}
)
 }

// اعتبارسنجی رفرش توکن
 let payload;

try{
payload=jwt.verify(accessToken,process.env.ACCEST_TOKEN_SECRET)
}
catch(err){
return NextResponse.json(
{success:false,message:"تاریخ توکن تمام شده یا در دسترس نیست"},
{status:401}
)
}



//حالا میریم یوزر پیدا میکنیم از اون توکن معتبر
const user=await UserSchema.findById(payload.userId)
.select("name phone email role createdAt purchesedCourses profileImage ")
.populate("purchesedCourses","title slug thumbnail lessonsCount totalDuration ")
.lean()


if(!user){
    return NextResponse.json(
{success:false, message:"user not found"},
{status:404}
    )
}

return NextResponse.json({success:true,user})



}







catch(error){
     console.log(error);
  return NextResponse.json(
{success:false, message:"khata dar server  "},
{status:500})
}




}



//برای تکمیل اطلاعات پر.فایل هر کاربر 
export async function PUT(req){
try{
await connectDB()
 // گرفتن کاربر
const cookieStore=await cookies()
const accessToken = cookieStore.get("accessToken")?.value;

if(!accessToken){
    return Response.json(
        {success:false,message:"ابتدا اول وارد شوید "},
        {status:401}
    )
}

  // اعتبارسنجی رفرش توکن
 let payload;

try{
payload=jwt.verify(accessToken,process.env.ACCEST_TOKEN_SECRET)
}
catch(err){
return NextResponse.json(
{success:false,message:"تاریخ توکن تمام شده یا در دسترس نیست"},
{status:401}
)
}

const user=await UserSchema.findById(payload.userId)
   if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "کاربر پیدا نشد."
                },
                { status: 404 }
            );
        }
        const formdata=await req.formData()
        const name=formdata.get("name")
        const email=formdata.get("email")
        const image=formdata.get("image")
user.name=name;
user.email=email





   //-----------------------------------
        // آپلود عکس
        //-----------------------------------

 if (image && image.size > 0) {

            // حذف عکس قبلی

            if (
                user.profileImage &&
                user.profileImage.startsWith("/uploads/")
            ) {

                const oldPath = path.join(
                    process.cwd(),
                    "public",
                    user.profileImage
                );

                try {
                    await fs.unlink(oldPath);
                } catch (err) {}
            }

            // ذخیره عکس جدید

            const bytes = await image.arrayBuffer();

            const buffer = Buffer.from(bytes);

            const fileName =
                Date.now() +
                "-" +
                image.name.replaceAll(" ", "-");

      const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads"
);

// اگر پوشه وجود نداشت، آن را ایجاد کن
await fs.mkdir(uploadDir, { recursive: true });

const uploadPath = path.join(uploadDir, fileName);

await fs.writeFile(uploadPath, buffer);
user.profileImage = `/uploads/${fileName}`;
        }

  await user.save();
  return Response.json({
            success: true,
            message: "پروفایل بروزرسانی شد.",
            user,
        });


}


catch(error){
  console.log(error);

        return Response.json(
            {
                success: false,
                message: "خطای سرور"
            },
            { status: 500 }
        );
}


}