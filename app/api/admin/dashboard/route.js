import connectDB from "@/configs/db";
import CourseSchema from "@/models/CourseSchema";
import UserSchema from "@/models/UserSchema";
import CommentSchema from "@/models/CommentSchema";
import OrderSchema from "@/models/OrderSchema";

export async function GET() {
  try {
    await connectDB();

    // اولین روز ماه جاری
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const [
      totalUsers,
      monthlyUsers,
      totalCourses,
      publishedCourses,
      totalComments,
      pendingComments,
      totalOrders,
      incomeResult,
    ] = await Promise.all([
      // تعداد کل کاربران
      UserSchema.countDocuments(),

      // کاربران ثبت‌نام شده در ماه جاری
      UserSchema.countDocuments({
        createdAt: {
          $gte: firstDayOfMonth,
        },
      }),

      // تعداد کل دوره‌ها
      CourseSchema.countDocuments(),

      // دوره‌های منتشر شده
      CourseSchema.countDocuments({
        statusPeriod: "published",
      }),

      // تعداد کل کامنت‌ها
      CommentSchema.countDocuments(),

      // کامنت‌های تایید نشده
      CommentSchema.countDocuments({
        status: "pending", 
      }),

      // تعداد کل سفارش‌ها
      OrderSchema.countDocuments(),

      // درآمد کل
      OrderSchema.aggregate([
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: "$price",
            },
          },
        },
      ]),
    ]);

    const totalIncome = incomeResult[0]?.totalIncome || 0;

    return Response.json(
      {
         success: true,
        dashboard: {
          totalUsers,
          monthlyUsers,
          totalCourses,
          publishedCourses,
          totalComments,
          pendingComments,
          totalOrders,
          totalIncome,
        },
      },
      { status: 200 }
    );
  } catch (error) {
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