import connectDB from "@/configs/db"
import UserSchema from "@/models/UserSchema"
import { redirect } from "next/dist/server/api-utils"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(req) {


    try{
   const {phone,otpCode}=await req.json()

    //بررسی شماره موبایل و کد
    if(!phone || !otpCode){
        return NextResponse.json(
            
            {success:false,message:"phone number and otpcode requred"},
            {status:400}

        )
    }

await connectDB()
//پیدا کردن کاربر توسط موبایل 
const user=await UserSchema.findOne({phone}).select(" name phone email role otp")
if(!user){
    return NextResponse.json(
        {success:false,message:"not found user"},
        {status:404}
    )
}
//بررسی کد درست توسط کاربر که کد هماهنگ باشد با گد وارد شده 
const{otp}=user
if(!otp || otp.code!==otpCode){
return NextResponse.json(
{success:false,message:"کد وارد شده درست نیست "},
{status:401}

)
}


// بررسی تاریخ کد انقضا که در زمان مناسب وارد کند
const currentTime=new Date().getTime()
const isExpired=currentTime>otp.expiresAt
if(isExpired){
user.otp=null //delete opt from mongoDb
await user.save()
return NextResponse.json(

{success:false,message:"کد منقضی شده است "},
{status:410}



)

}


//access token and refresh token
const accessPayload={
userId:user._id.toString(),
phone:user.phone,
role:user.role
}



const accessToken=jwt.sign(
accessPayload,
process.env.ACCEST_TOKEN_SECRET,
{expiresIn:"1h"}
)


const refreshToken=jwt.sign(
accessPayload,
process.env.REFRESH_TOKEN_SECRET,
{expiresIn:"7d"}
)

//ذخیره رفرش توکن در پایگاه داده 

user.refreshToken=refreshToken
user.otp=null,
user.isverified=true
user.lastLoginAt=new Date()
await user.save()


//ذخیره در کوکی ها 
const cookieStore=await cookies()

cookieStore.set("accessToken",accessToken,{

httpOnly:true,
maxAge:60*60, //15دقیقه
sameSite:"strict",
secure:process.env.NODE_ENV ==="production",
path:"/"
})


cookieStore.set("refreshToken",refreshToken,{

httpOnly:true,
maxAge:7*24*60*60, //15دقیقه
sameSite:"strict",
secure:process.env.NODE_ENV ==="production",
path:"/"
})




 return  NextResponse.json(

{
success:true,
message:"opt code is accepted",
redirect:user.role==="admin"?"/admin/dashboard":"/profile",
user:{
userId:user._id.toString(),
phone:user.phone,
name:user.name || "",
role:user.role,
purchesedCourses:user.purchesedCourses || [],
}},
{status:200}





)













    }
    catch(error){
        console.log("error verifiyin otp",error)
        return NextResponse.json(
{success:false,message:"error server"},
{status:500}

        )

    }
 
    
}