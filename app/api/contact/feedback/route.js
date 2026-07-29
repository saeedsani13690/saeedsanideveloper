import connectDB from "@/configs/db";
import FeedbackSchema from "@/models/FeedbackSchema";
import { NextResponse } from "next/server";



export async function POST(request){
try{
await connectDB()
const body = await request.json();
const{name,email,message,rating}=body


if (!message?.trim()) {
  return NextResponse.json(
    { message: "متن نظر الزامی است." },
    { status: 400 }
  );
}

if (!rating) {
  return NextResponse.json(
    { message: "امتیاز را انتخاب کنید." },
    { status: 400 }
  );
}

const feedback=await FeedbackSchema.create({
    name,
  email,
  message,
  rating, 
})

return NextResponse.json(
  {
    message: "نظر شما با موفقیت ثبت شد.",
    feedback,
  },
  { status: 201 }
);




}

catch(error){
  console.error(error);

    return NextResponse.json(
      { message: "خطای سرور" },
      { status: 500 }
    );
}




}