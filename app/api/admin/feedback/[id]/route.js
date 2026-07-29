import connectDB from "@/configs/db";
import FeedbackSchema from "@/models/FeedbackSchema";


// این برای وضعیت فیدبک کاربر که نشان دهیم اون رو خوندیم 
export async function PATCH(req,{params}){
try{
await connectDB()
const{id}=await params

const feedback=await FeedbackSchema.findByIdAndUpdate(id,{
status:"approved",
isReadByAdmin:true
})
return Response.json(
    {success:true,message:"بیام خوانده شد ",feedback}
)



}

catch(error){
console.log(error)
return Response.json(
    {success:false,message:"خطا در شبکه "},
    {status:500}
)
}

}


export async function DELETE(req,{params}){

try{
await connectDB()
const{id}=await params
const feedback=await FeedbackSchema.findByIdAndDelete(id)
return Response.json(
    {success:true,message:"بیام حذف شد "},
{status:201}
)

}


catch(error){
console.log(error)
return Response.json(
    {success:false,message:"خطا در شبکه  "},
    {status:500}
)
}


}