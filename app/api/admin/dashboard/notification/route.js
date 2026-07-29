import connectDB from "@/configs/db";
import { NextResponse } from "next/server";

import Comment from "@/models/CommentSchema";
import FeedbackSchema from "@/models/FeedbackSchema";
import UnansweredQuestion from "@/models/UnansweredQuestion";
import ContactSchema from "@/models/ContactSchema";


export async function  GET() {
    try{
await connectDB()


const comments=await Comment.countDocuments({ isReadByAdmin: false,})
const Feedbacks=await FeedbackSchema.countDocuments({ isReadByAdmin: false,})
const UnansweredQuestions=await UnansweredQuestion.countDocuments({ isReadByAdmin: false,})
const Contacts=await ContactSchema.countDocuments({ isReadByAdmin: false,})
const total=comments+Feedbacks+UnansweredQuestions+Contacts


return NextResponse.json({
  success: true,

  notifications: {
    comments,
    Feedbacks,
    UnansweredQuestions,
    Contacts,
    total,
  },
});


    }
    
    catch(error){
return NextResponse.json({
      success: false,
      message: "خطا در دریافت اعلان‌ها",
    });
    }
}