
import connectDB from "@/configs/db";
import UnansweredQuestion from "@/models/UnansweredQuestion";
// این بابت این است که ایدی اون سوال رو بگیریم بعد اگر ادمین چاسخ داد از دیتا بیس چاک کند 
export async function DELETE(req,{params}) {
try{
await connectDB()
const {id}=await params
const unanswerQuestion=await UnansweredQuestion.findByIdAndDelete(id)

if(!unanswerQuestion){
    return Response.json(

{success:false,message:"سوال چیدا نشد "},
{status:404}

    )
}

 return Response.json({
            success: true,message:"سوال توسط ادمین باسخ داده شد و حذف شد "
        });




}


catch(error){
   return Response.json(
            {
                success: false,
                message: "خطا در سرور"
            },
            {
                status: 500
            }
        );

}



    
}