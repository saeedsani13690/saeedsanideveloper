import connectDB from "@/configs/db";
import Comment from "@/models/CommentSchema";


export async function GET(req,{params}) {
try{
await connectDB()

 const { searchParams } = new URL(req.url);
const search=searchParams.get("search") || "";
const statuscommnet=searchParams.get("statuscommnet") || ""



const comments = await Comment.find(
  statuscommnet
    ? { status: statuscommnet }
    : {}
)
.populate("user", "name")
.populate("course", "title")
.sort({ createdAt: -1 });

//این براساس سرچ میاد اون دوره پیدا میکنه 
const filteredComments =search?comments.filter((comment)=>
    comment.course?.title?.toLowerCase().includes(search.toLowerCase())
):comments
return Response.json({
  success: true,
  comments: filteredComments,
});


}



catch(error){
 console.log(error);

    return Response.json(
      {
        success: false,
        message:
          "خطا در دریافت کامنت‌ها",
      },
      {
        status: 500,
      })
}
    
}