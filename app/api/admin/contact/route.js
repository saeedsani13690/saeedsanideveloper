import connectDB from "@/configs/db";
import ContactSchema from "@/models/ContactSchema";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";
import { NextResponse } from "next/server";



export async function GET(req) {

    try{
await connectDB()
const authisadmin=IsAdmin(req)
 if(!authisadmin.isAdmin){
    return authisadmin
 }


 const contacts=await ContactSchema.find({}).sort({createdAt: -1})
 return Response.json(contacts)
    }
    
    
    catch(error){
        console.log(error)
 return NextResponse.json(
      { message: "خطای سرور" },
      { status: 500 }
    );
    }
    
}