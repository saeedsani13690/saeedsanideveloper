import connectDB from "@/configs/db";
import Comment from "@/models/CommentSchema";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";

export async function DELETE(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const id = params.id;

    const authisadmin = IsAdmin(req);

    if (!authisadmin.isAdmin) {
      return authisadmin;
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return Response.json(
        {
          success: false,
          message: "نظری پیدا نشد",
        },
        { status: 404 }
      );
    }

    await Comment.findByIdAndDelete(id);

    return Response.json(
      {
        success: true,
        message: "کامنت با موفقیت پاک شد",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERROR =>", error);
    console.log("MESSAGE =>", error.message);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}



export async function PATCH(req,context) {
    try{
await connectDB()
  const params = await context.params;
    const id = params.id;

const authisadmin = IsAdmin(req);

    if (!authisadmin.isAdmin) {
      return authisadmin;
    }

    const {status}= await req.json()
const comment=await Comment.findById(id)
 if (!comment) {
      return Response.json(
        {
          success: false,
          message: "نظری پیدا نشد",
        },
        { status: 404 }
      );
    }

     comment.status = status;
await comment.save();
return Response.json(
    {success:true,message:"کامنت اپدیت شد "},
    {status:201}
)

    }


    catch(error){
console.log(error.message)
return Response.json(
{success:false,message:"خطا در سرور"},
{status:500}

)
    }


}