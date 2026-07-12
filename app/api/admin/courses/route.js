import connectDB from "@/configs/db";
import { NextResponse } from "next/server";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";
import course from "@/models/CourseSchema"
export async function GET(req){

try{
await connectDB()
const authisadmin=IsAdmin(req)

 if(!authisadmin.isAdmin){
    return authisadmin
 }



// search query
const {searchParams}=new URL(req.url)
const search=searchParams.get("search") || ""
const query=search?{title:{$regex:search}}:{}








//get single course for admin

const courses=await course.find(query)

return Response.json({success:true,courses})
}


catch(errror){
return Response.json(
    {success:false,message:"خطا در سرور "},
    {status:500}
)
}

}