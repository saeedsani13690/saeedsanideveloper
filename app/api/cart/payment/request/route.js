

import connectDB from "@/configs/db";
import OrderSchema from "@/models/OrderSchema";
import { getcurrentUSer } from "@/utils/authIsAdminTrueOrFales";
import { NextResponse } from "next/server";


export async function POST(req){
try{
await connectDB()
// اهتبا سنجی توکن 
const user=getcurrentUSer(req)
if(!user){
  return NextResponse.json(
    {success:false,message:"لطفا اول لاگین گنید "},
    {status:401}
  )
}


// اینجا ایدی اون سفارش رو میگیریم
const {orderId}= await req.json() 
if(!orderId) {
  return NextResponse.json(
    {success:false,message:"ایدی سفارش الزمای است "},
    {status:401}
  )
}


// اینجا خود اون سفارش رو از دیتابیس میکشیم بیرون 
const order=await OrderSchema.findById(orderId)
if(!order){
  return NextResponse.json(
    {success:false,message:"سفارش شما بیدا نشد "},
    {status:404}
  )
}

// جک میکنیم سفارش مربوط به مین کاربر باشد 
if(order.user.toString() !== user.userId.toString() ){
  return NextResponse.json(
    {succcess:fasle,message:"این محصول برای شما نیست "}
  )
}


// فقط سفارش های که در حال ذانتظار است حق رفتم به دگاه برداخت دارند 
if(order.status!== "pending"){
  return NextResponse.json(
    {success:false,message:"این سفارش قابل برداخت نیست "},
    {status:400}
  )
}

// اول یک رکویست میزنیم به زرین بال برای درگاه برداخت 
const response=await fetch("https://sandbox.zarinpal.com/pg/v4/payment/request.json",{
method:"POST",
headers: {
  "Content-Type": "application/json"
},
body:JSON.stringify({
merchant_id:process.env.ZARINPAL_MERCHANT_ID,
currency:"IRT",
amount:order.totalprice,
callback_url:process.env.CALLBACKURL,
description:`Order${order.id}`
})

})
const resultpeyment=await response.json()


 
// ببرسی این که کد 100 داده یا ارور
// اینجا میخوایم اون اتوریزی رو بگیریم 
if(resultpeyment.data.code!==100){
  return NextResponse.json(
    {success:false,message:"درخواست برداخت موفق نبود ه است  "},
    {status:400}
  )
}

// اینجا در واقع اون کد اتوریزی رو داخل اون سفارش قرار میدهیم 
order.authority=resultpeyment.data.authority
await order.save()


// حالا باید کاربر رو انتقال ذبدهیم به صفحه برداخت با اون اتوریزی 
return NextResponse.json(
{success:true,
  paymentUrl:`https://sandbox.zarinpal.com/pg/StartPay/${resultpeyment.data.authority}` 
}

)


}

catch(error){
console.log(error)

return NextResponse.json(
  {success:false,message:"خطا در سرور"},
  {status:500}
)
}

}