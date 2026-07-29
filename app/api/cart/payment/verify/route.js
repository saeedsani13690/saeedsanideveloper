

// این روت باعث میشه اون اتوریتی رو بگیریم 
// مقدارش رو ببرسی کنم براساس اون 
// کاربر رو به صفحه درست منتقل کنم و به اون دوره دانشجو رو اضافه کنیم 
// و به داشنجو اون ذوره اضافه کنیم 
import connectDB from "@/configs/db";
import UserSchema from "@/models/UserSchema";
import OrderSchema from "@/models/OrderSchema";
import { NextResponse } from "next/server";
import CourseSchema from "@/models/CourseSchema";



export async function POST(req) {
  try{
await connectDB()

// اینجا اون اتوریزی رو میگریم 
// وضعیت برداخت هم رو میگیریم 
const {authority,status}=await req.json()
if(!authority){
  return NextResponse.json(
    {success:false,message:"اتوریتی ضروری است "},
    {status:400}
  )
}


// اینجا براساس اون اتوریتی اون سفارش رو بیدا میکگنیم 
const order=await OrderSchema.findOne({authority})
if(!order){
  return NextResponse.json(
    {success:false,message:"سفارش شما بیدا نشد "},
    {status:404}
  )
}


// اگر قبلا برداخت شده است این کارو میکنیم 
if(order.status==="paid"){
 return NextResponse.json(
  {success:false,message:"برداخت قبلا انجام شده است "},
 ) 
}


// اگر کاربر لغو برداخت بزند
if(status!=="OK"){
order.status="failed",
await order.save()
return NextResponse.json({success:false,message:"برداخت لغو شد "})
}


// حالا میریم اون برداخت رو اعتبار سنجی مینکنیم تا بتوانبین باسخ مناسب به کاربر بدهیم 
//verify
const response=await fetch("https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
,{
method:"POST",
headers:{"Content-Type": "application/json",},
body:JSON.stringify({
merchant_id:process.env.ZARINPAL_MERCHANT_ID,
amount:order.totalprice,
authority:authority
})
})

const result=await response.json()
if(result.data.code !==100 && result.data.code !== 101){
  order.status="failed",
  await order.save()
  return NextResponse.json(
    {success:false,message:"برداخت ناموفق بود "},
    {status:400 }
  )
}


// خب حالا برداخت موفق وبده باید بیایم مفقادیر سفارش رو درست کنیم
order.status="paid",
order.refId = String(result.data.ref_id);// شناسه برداخت موفق
order.paidAt=new Date()// تاریخ فعلی برداخت رو میریریم 
await order.save()


// اینجا دوره ها به کارب اضافه میکینم 
const user=await UserSchema.findById(order.user)
const purchesedCourses=order.items.map((item)=>item.course)
user.purchesedCourses.push(...purchesedCourses)
await user.save()


// اینجا باید به دوره تعداد دانشجویان هم اضافه نیم
for(const  item of order.items){
const course=await CourseSchema.findById(item.course)
if(!course) continue
course.studentsCount += 1;
  await course.save();
}





// در نهاین یک باسخ مناسب به کارب میفرستیم 
return NextResponse.json(
  {success:true,message:"خرید با موفقیت انجام شد ",refId: order.refId,},
  {status:200}
)

  }


  
  
  catch(error){
console.log(error)
return NextResponse.json(
  {success:false,message:"خطا در سرور "},
  {status:500}
)
  }
}
