
import connectDB from "@/configs/db";
import OrderSchema from "@/models/OrderSchema";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";
import { NextResponse } from "next/server";
export async function GET(req){
try{
await connectDB()

const authisadmin=IsAdmin(req)
 if(!authisadmin.isAdmin){
    return authisadmin
 }

 // حالا میخوایم سفارشها رو بگیریم 
 const{searchParams }=new URL(req.url)

 const page = Number(searchParams.get("page")) || 1;
 const limit=5;

 const orders=await OrderSchema.find()
 .populate("user", "name phone")
 .populate("items.course", "title slug thumbnail" )
 .sort({ createdAt: -1 })
 .skip((page-1)*limit)
 .limit(limit)
 .lean()

// اینجا تعداد سفارش ها رو مییگریم 
const totalOrders=await OrderSchema.countDocuments({})
const totalPages = Math.ceil(totalOrders / limit);


return NextResponse.json({
    success:true,
    orders,
    totalOrders,
    totalPages,
    currentPage:page
})


}

catch(error){
console.log(error)
return NextResponse.json(
    {success:false,message:"خطا در شبکه "},
    {status:500}
)
}
}