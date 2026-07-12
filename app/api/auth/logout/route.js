import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import connectDB from "@/configs/db";
import UserSchema from "@/models/UserSchema";
import { NextResponse } from "next/server";

export async function POST(){
try{
//خواندن کوکی 
const cookieStore=await  cookies()

const refreshToken=cookieStore.get("refreshToken")?.value

let userId=null

if(refreshToken){
  try{
    const payload=jwt.verify(
refreshToken,
process.env.REFRESH_TOKEN_SECRET
    )
    userId=payload.userId
  }
  catch(error){
    //توکن نامعنبر بود عیبی ندارد پاکش کن
console.log("refresh token invalid",error.message)
  }  
}

if(userId){
    //حتی اگر به دیتا وصل نشدی متوقف نشو
await connectDB().catch(()=>{})
 await UserSchema.findByIdAndUpdate(userId,{
$unset:{refreshToken:"",isverified:false} })
}


const response=NextResponse.json(
{success:true,message:"logout is succesfully"},
{status:200}
)



response.cookies.delete("accessToken",{
httpOnly:true,
path:"/",
sameSite:"strict",
secure:process.env.NODE_ENV==="production"

})

response.cookies.delete("refreshToken",{
httpOnly:true,
path:"/",
sameSite:"strict",
secure:process.env.NODE_ENV==="production"

})
return response;

}



catch(error){
return NextResponse.json(
{success:false,message:"khoroj nemtoni bekoni" },
{status:500}


)
}



}