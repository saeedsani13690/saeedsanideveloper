import FaqSchema from "@/models/FaqSchema";
import connectDB from "@/configs/db";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";
import { getEmbedding } from "../../chatBot/openai";

// برای گرفتن سوالات سات 
export async function GET(req) {
    try{
await connectDB()


const authisadmin=IsAdmin(req)

 if(!authisadmin.isAdmin){
    return authisadmin
 }


 const {searchParams }=new URL(req.url)
 // برای گرفتن کدام صفحه رکویست داده 
 const page=Number(searchParams.get("page")) || 1;
 // در هر صفحه چند سوال نمایش بده 
 const limit=Number(searchParams.get("limit")) || 5;

 // برای رد کردن اون سوالات که میخوام 
 const skip=(page-1)*limit


const questions=await FaqSchema.find()
.sort({createdAt:-1})
.skip(skip)
.limit(limit)
// همه سوالات موجود را میشمارد تا دسته بندی درذست بشه 
const totalquestion=await FaqSchema.countDocuments()

return Response.json(
{success: true,
            questions,
            page,
            limit,
            totalquestion,
            totalPages: Math.ceil(totalquestion / limit)}

)

    }
    
    
    catch(error){
 return Response.json(
            {
                success:false,
                message:"خطا در سرور"
            },
            {
                status:500
            }
        );
    }
}


// برای ایجاد سوالات سایت توسط ادمین 

export async function POST(req){
try{
await connectDB()
const body=await  req.json()
const { question,answer, keywords}=body


const embedding = await getEmbedding(question);


const faq=await FaqSchema.create({question, answer, keywords,embedding})


return Response.json({ success:true,faq });



}


catch(error){
  return Response.json(
            {
                success:false,
                message:"خطا در سرور"
            },
            {
                status:500
            }
        );
}
}