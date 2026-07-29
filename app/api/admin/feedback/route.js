import connectDB from "@/configs/db";
import FeedbackSchema from "@/models/FeedbackSchema";
import { NextResponse } from "next/server";



export async function GET() {
    try{
await connectDB()

const feedbacks=await FeedbackSchema.find().sort({createdAt: -1})
return NextResponse.json(feedbacks);


    }
    
    
    catch(error){
console.error(error);

    return NextResponse.json(
      { message: "خطای سرور" },
      { status: 500 }
    );
    }
}