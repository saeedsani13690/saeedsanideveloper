import connectDB from "@/configs/db";
import CourseSchema from "@/models/CourseSchema";



export async function GET(req){
try{
await connectDB()
const{searchParams}=new URL(req.url)
const limit=parseInt(searchParams.get("limit") ) || 4;
const course=await CourseSchema.find({statusPeriod:"published"})
.sort({createdAt:-1})
// .limit(limit)
.select(
    "title slug shortDescription thumbnail price discountPrice isfree levelPeriod studentsCount"
)
.lean()

return Response.json({course})
}


catch(error){
    console.log("error fetching in courses", error)
return Response.json(
{success:false,message:"خطای سرور "},
{status:500}


)
}


}