import connectDB from "@/configs/db";
import getCurrentUser from "@/utils/getCurrentUser";
import CourseSchema from "@/models/CourseSchema";
import OrderSchema from "@/models/OrderSchema";
import { NextResponse } from "next/server";
export async function POST(req,{params}) {

try{
    await connectDB()


    // تعتبار سنجب اولیه کاربر
  const user=await getCurrentUser(req)  
  if(!user){
    return NextResponse.json(
{success:false,message:"لطفا اول لاگین کنید"},
{status:401}
    ) 
  }

// ایدی اون محصولات رو میفرستیم که میخواد خرید کنه 
  const {courseIds}=await req.json()
  if(!Array.isArray(courseIds)||courseIds.length===0 ) {
    return NextResponse.json(
{success:false,message:"محصول الزامی است و هیچ محصولی وارد نشده "},
{status:400}
    )
  } 


  // دریافت دور ها 
  const courses=await CourseSchema.find(
    {_id:{$in:courseIds}}
  )
  if(courses.length!==courseIds.length){
    return NextResponse.json(
        {success:false,message:"بعضی از محصولات داخل دیتابیس نیست "},
        {status:404}
    )
  }


  // اینجا باید ایتم ها رو درست کرد یعنی هر محصول دارای چه مقدیری است 

  const items= courses.map((course)=>({
course:course._id,
price:course.price
  }))



  // محاسبه مبلغ نهایی اتم ها
  const totalprice=items.reduce((sum,item)=>sum+item.price,0)


  // حالا سفارش رو میخوایم بسازیم
  const order=await OrderSchema.create(
    {
user:user._id,
items,
totalprice

    }
  )

  // درنهایت این سفارش رو برمیگردانیم
  return NextResponse.json(

{success:true,message:"سفارش شما ساخته شد ",orderId:order._id},
{status:201}

  )

}



catch(error){
console.log(error)
return NextResponse.json(
    {success:false,message:"خطا ذر شبکه "},
    {status:500}
)
}

    
}