import connectDB from "@/configs/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import UserSchema from "@/models/UserSchema";
import CourseSchema from "@/models/CourseSchema";
//import fs from "fs/promises"
//import path from "path";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/configs/ArvanCloud";


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
.select("name phone email role createdAt purchesedCourses profileImage lastLoginAt ")
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
// آپلود عکس پروفایل جدید
//-----------------------------------

if (image && image.size > 0) {

    // اگر کاربر قبلاً عکس پروفایل داشته باشد،
    // ابتدا آن را از Arvan Cloud حذف می‌کنیم.
    if (user.profileImage) {
        try {

            // استخراج مسیر (Key) عکس از آدرس کامل ذخیره شده در دیتابیس
            const oldKey = user.profileImage.split(
                `${process.env.ARVAN_BUCKET}/`
            )[1];


            if(oldKey){
 await s3.send(
                new DeleteObjectCommand({
                    Bucket: process.env.ARVAN_BUCKET,
                    Key: oldKey,
                })
            );
            }

           

        } catch (error) {
            console.log("Old profile image not found.");
        }
    }

    // تبدیل فایل انتخاب شده به Buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // استخراج پسوند فایل (jpg, png, webp, ...)
    const extensionImage = image.name.split(".").pop();  //["my-photo","png"]

    // ساخت مسیر ذخیره عکس داخل باکت Arvan
    const imageKey = `avatars/${user._id}-${Date.now()}.${extensionImage}`;

    // آپلود عکس جدید در Arvan Cloud
    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.ARVAN_BUCKET,
            Key: imageKey,
            Body: buffer,
            ContentType: image.type,
        })
    );

    // ذخیره آدرس کامل عکس در دیتابیس
user.profileImage = `${process.env.ARVAN_ENDPOINT}/${process.env.ARVAN_BUCKET}/${imageKey}`;
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