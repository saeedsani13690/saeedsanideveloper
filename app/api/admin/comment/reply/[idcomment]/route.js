import connectDB from "@/configs/db";
import Comment from "@/models/CommentSchema";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";

export async function POST(req, { params }) {
    
  try {
    await connectDB();
    const authisadmin =IsAdmin(req);

    if (!authisadmin.isAdmin) {
      return authisadmin;
    }

   const { idcomment } = await params;

    const { body } = await req.json();

    if (!body?.trim()) {
      return Response.json(
        {
          success: false,
          message: "متن پاسخ الزامی است",
        },
        { status: 400 }
      );
    }

    const comment = await Comment.findByIdAndUpdate(
      idcomment,
      {
        $push: {
          replies: {
            body,
             admin: authisadmin.userId,
             
          },
        },
      },
      { new: true }
    );



   await Comment.findByIdAndUpdate(
  idcomment,
  {
    $set: {
      status: "approved",
    },
  }
);

    if (!comment) {
      return Response.json(
        {
          success: false,
          message: "نظر پیدا نشد",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "پاسخ ثبت شد",
        comment,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}