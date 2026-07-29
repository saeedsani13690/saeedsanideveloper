import connectDB from "@/configs/db";
import { NextResponse } from "next/server";
export async function PUT(request){

try{
await connectDB()
const formData=await request.formData()
const image=formData.get("image")
console.log(image)



  return NextResponse.json({
      success: true,
      message: "اطلاعات دریافت شد"
    });

}


catch(error){
   console.log(error);
    return NextResponse.json({
      success: false,
      message: "خطای سرور"
    }, { status: 500 })
}



}