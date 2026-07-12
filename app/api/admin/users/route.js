import connectDB from "@/configs/db";
import UserSchema from "@/models/UserSchema";
import { NextResponse } from "next/server";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";



export async function  GET(req) {
    try{
await connectDB()
 const authisadmin=IsAdmin(req)

 if(!authisadmin.isAdmin){
    return authisadmin
 }

//دستورات کویری برای سرچ کاربر
const {searchParams}=new URL(req.url)
const search=searchParams.get("search") || ""
//دست.رات بابنت نمایش تعداد کاربران یا کدام صفحه 
const page=searchParams.get("page") || 1;
//تعداد نمایش کاربران در ه صفحه
const limit=5


const query=search?{
$or:[
    {name:{$regex:search}},
    {phone:{$regex:search}},
    {email:{$regex:search}},

]}
:
{}




const users=await UserSchema.find(query)
.select("_id name email role phone isverified createdAt")
.skip((page-1)*limit)
.limit(limit)
.lean()

const totalusers=await UserSchema.countDocuments(query)


return NextResponse.json(
    {success:true,users,totalusers},
    {status:200}

)
    }
    catch(error){
        console.log(error)
return NextResponse.json(
    {success:false,message:"interval server error"},
    {status:500}

)
    }

} 