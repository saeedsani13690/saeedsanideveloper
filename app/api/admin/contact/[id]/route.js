import connectDB from "@/configs/db";
import ContactSchema from "@/models/ContactSchema";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";
import { NextResponse } from "next/server";


export async function PATCH(req,{params}) {


try{
await connectDB()
const authisadmin=IsAdmin(req)
 if(!authisadmin.isAdmin){
    return authisadmin
 }

 const{id}=await params
 const contact=await ContactSchema.findByIdAndUpdate(id,{status:"read",isReadByAdmin:true})

if (!contact) {return NextResponse.json({ message: "پیام پیدا نشد." },  { status: 404 });    }
      
  return Response.json(
{success:true,message:"بیام خوانده شده",contact}


  )      
      
      









}

catch(error){
console.log(error);

    return NextResponse.json(
      { message: "خطای سرور" },
      { status: 500 }
    );
}

    
}



export async function  DELETE(req,{params}) {
try{
await connectDB()
const{id}=await params
const contact=await ContactSchema.findByIdAndDelete(id)

 if (!contact) {
      return Response.json(
        { message: "پیام پیدا نشد" },
        { status: 404 }
      );
    }

    return Response.json({success:true,message:"بیام حذف شد "})
}


catch(error){}
return Response.json(
      { message: "خطای سرور" },
      { status: 500 }
    );

  
}