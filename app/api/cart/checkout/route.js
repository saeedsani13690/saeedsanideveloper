import connectDB from "@/configs/db";

import UserSchema from "@/models/UserSchema";
import CourseSchema from "@/models/CourseSchema";
import OrderSchema from "@/models/OrderSchema";
import { getcurrentUSer } from "@/utils/authIsAdminTrueOrFales";

export async function POST(req) {
  try {
    await connectDB();

    // بررسی لاگین بودن کاربر
    const currentUser = getcurrentUSer(req);

    if (!currentUser.success) {
      return Response.json(
        { success: false, message: "لطفا اول لاگین کنید." },
        { status: 401 }
      );
    }

    const { courseids } = await req.json();

    // پیدا کردن کاربر
    const user = await UserSchema.findById(currentUser.userId);

    if (!user) {
      return Response.json(
        { success: false, message: "کاربر پیدا نشد." },
        { status: 404 }
      );
    }

    // بررسی اینکه دوره‌ای قبلاً خریداری نشده باشد
    const alreadyPurchased = courseids.find((id) =>
      user.purchesedCourses.some(
        (courseid) => courseid.toString() === id.toString()
      )
    );

    if (alreadyPurchased) {
      return Response.json(
        {
          success: false,
          message: "یکی از دوره‌ها قبلاً توسط شما خریداری شده است.",
        },
        { status: 400 }
      );
    }

    // دریافت همه دوره‌ها
    const courses = await CourseSchema.find({
      _id: { $in: courseids },
    });

    if (courses.length !== courseids.length) {
      return Response.json(
        {
          success: false,
          message: "بعضی از دوره‌ها پیدا نشدند.",
        },
        { status: 404 }
      );
    }

    // ثبت خرید برای کاربر
    user.purchesedCourses.push(...courseids);
    await user.save();

    // ثبت سفارش‌ها
    await OrderSchema.insertMany(
      courses.map((course) => ({
        user: user._id,
        course: course._id,
        price: course.discountPrice || course.price,
        status: "paid",
      }))
    );

    // افزایش تعداد دانشجویان هر دوره
    await Promise.all(
      courses.map(async (course) => {
        course.studentsCount += 1;
        await course.save();
      })
    );

    return Response.json({
      success: true,
      message: "خرید با موفقیت انجام شد.",
    });
  } catch (error) {
    console.log("Error in purchase:", error);

    return Response.json(
      {
        success: false,
        message: "خطای سرور",
      },
      { status: 500 }
    );
  }
}