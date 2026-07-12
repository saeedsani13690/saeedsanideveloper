//بابت ایجاد رفرش توکن و دسترسی توکن مثل اینکه هر جا سایت میخواد بره بیاد این محل کارت خود راشارژ کند


import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import connectDB from "@/configs/db";
import UserSchema from "@/models/UserSchema";


export async function POST(req){

const cookieStore=await cookies()
try{
    //بابت گرفتن رفرش توکن در کوکی 
const refreshToken=cookieStore.get("refreshToken")?.value
//اگر رفرش توکن وجود نداشت این پیام رو بده
if(!refreshToken){
    return NextResponse.json(
{success:false,message:"refresh token not provied"},
{status:401}
    )
}

//اعتبار سنجی رفرش توکن 
let payload;
try{
payload=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
}
catch(error){
//اگر رفرش توکن نامعتبر یا تاریخ نقضا گذشته بود از کوکی پاک کن

cookieStore.delete("refreshToken",{path:"/"})
cookieStore.delete("accessToken",{path:"/"})

return NextResponse.json(
    {success:false,message:"رفرش توکن نامعتبر یا منقضی شده "},
    {status:401}
)
}

//اعتبار سنجی فرد برای رفرش توکن مورد نظر 

await connectDB();
const user=await UserSchema.findById(payload.userId)
if(!user){
cookieStore.delete("refreshToken",{path:"/"})
cookieStore.delete("accessToken",{path:"/"})

return NextResponse.json(
    {success:false,message:" شخص مورد نظر یافت نشد      "},
    {status:401}
)
}

//تولید اککس توکن جدید برای دسترسی های دوباره 
const newaccessTokne=jwt.sign(
{userId:user._id,
phone:user.phone,
role:user.role
},
process.env.ACCEST_TOKEN_SECRET,
{expiresIn:"15m"}
)



//رسپانس مناسب
const response=NextResponse.json(
{
success:true,
message:"اکسس توکن دوباره تولید شد ",
user:{
id:user._id.toString(),
phone:user.phone,
role:user.role || "user"
}
}
)

//حالا میخواهیم این اککس توکن رو در کوکی دوباره ذخیره کنیم
response.cookies.set("accessToken",newaccessTokne,{
httpOnly:true,
maxAge:15*60, //15دقیقه
sameSite:"strict",
secure:process.env.NODE_ENV ==="production",
path:"/"



})

return response

}

catch(error){
cookieStore.delete("refreshToken",{path:"/"})
cookieStore.delete("accessToken",{path:"/"})

return NextResponse.json(
    {success:false,message:"     خطای سرور در تولید اکسس توکن      "},
    {status:500}
)


}

}