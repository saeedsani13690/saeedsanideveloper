import CourseSchema from "@/models/CourseSchema";
import connectDB from "@/configs/db";
import Comment from "@/models/CommentSchema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
//این apiبرای این است که کامنتها ثبت بشوند 
export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return Response.json(
        { message: "ابتدا وارد حساب کاربری شوید" },
        { status: 401 }
      );
    }

    let payload;

    try {
      payload = jwt.verify(
        token,
        process.env.ACCEST_TOKEN_SECRET
      );
    } catch {
      return Response.json(
        { message: "توکن نامعتبر یا منقضی شده است" },
        { status: 401 }
      );
    }




    await connectDB();




    const { body, courseId,score } = await req.json();



const existingComment=await Comment.findOne({
     user:payload.userId,
  course: courseId
}) 
if (existingComment) {
  return Response.json(
    {
      message: "شما قبلاً برای این دوره نظر ثبت کرده‌اید",
    },
    { status: 409 }
  );
}


    if (!body?.trim() || !courseId) {
      return Response.json(
        { message: "اطلاعات نامعتبر است" },
        { status: 400 }
      );
    }

    const course = await CourseSchema.findById(courseId);

    if (!course) {
      return Response.json(
        { success:false, message: "دوره یافت نشد" },
        { status: 404 }
      );
    }

    await Comment.create({
      body,
      user: payload.userId,
      course: courseId,
      score
    });

    await CourseSchema.findByIdAndUpdate(courseId, {
      $inc: { commentsCount: 1 },
    });

    return Response.json(
      {
        success: true,
        message: "نظر شما ثبت شد",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {success:false, message: "خطا در ثبت نظر" },
      { status: 500 }
    );
  }
}




// برای دریافت کامنتهای هر دوره برای کاربران 
export async function GET(req){
try{
await connectDB()
 const { searchParams } = new URL(req.url);
const courseId=searchParams.get("courseId")

  if (!courseId) {
      return Response.json(
        {
          success: false,
          message: "شناسه دوره ارسال نشده است",
        },
        { status: 400 }
      );
    }

const comments = await Comment.find({
  course: courseId,
  status: "approved",
})
  .populate("user", "name profileImage")
  .sort({ createdAt: -1 })
  .lean();


  return Response.json({
      success: true,
      comments,
    });

}


catch(error){
 console.log(error);

    return Response.json(
      {
        success: false,
        message: "خطای سرور",
      },
      { status: 500 }
    );
}
}