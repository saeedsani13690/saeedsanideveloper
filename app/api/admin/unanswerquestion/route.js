import connectDB from "@/configs/db";
import UnansweredQuestion from "@/models/UnansweredQuestion";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";

export async function GET(req) {
    try{
await connectDB()


const authisadmin=IsAdmin(req)
 if(!authisadmin.isAdmin){
    return authisadmin
 }




const { searchParams } = new URL(req.url);
const page=searchParams.get("page") || 1
const limit=searchParams.get("limit") || 5;
const skip=(page-1)*limit;

const question=await UnansweredQuestion.find()
.sort({createdAt: -1})
.skip(skip)
.limit(limit)

const totalunanswerQuestion=await UnansweredQuestion.countDocuments()

return Response.json(

{success:true,question,page,limit,totalunanswerQuestion,totalpage:Math.ceil(totalunanswerQuestion/limit)}
)




    }
    
    catch(error){
 return Response.json(
            {
                success: false,
                message: "خطا در دریافت سوالات"
            },
            {
                status: 500
            }
        );
    }
    
}