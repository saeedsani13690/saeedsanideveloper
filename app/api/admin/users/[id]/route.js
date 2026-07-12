import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";
import connectDB from "@/configs/db";
import { NextResponse } from "next/server";
import UserSchema from "@/models/UserSchema";

export async function PATCH(req,{params}) {
    try{

await connectDB()
const authisadmin=IsAdmin(req)
 if(!authisadmin.isAdmin){
    return authisadmin
 }


const{id}= await params

if(!id){
    return NextResponse.json(
        {success:false,message:"ایدی ضروری است "},
        {status:400}
    )
}


const body= await req.json()
 const{name,email,role}=body
 console.log(name,email,role)

const user=await UserSchema.findById(id)

if(!user){
    return NextResponse.json(
        {success:false,message:"کاربر پیدا نشد "},
        {status:404}
    )
}

if(name !==undefined) user.name=name || "";
if(email !==undefined) user.email=email || null;
if(role !==undefined) user.role=role

 await user.save()

 const updateuser=await UserSchema.findById(id).select("name role email phone")


return NextResponse.json(
    {success:true,
        message:"user update ",
        user:updateuser
      
    }
)


    }
    
    
    catch(err){
      
return NextResponse.json(
    {success:false,message:err.message},
    {status:500}
)
    }
}