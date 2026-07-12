import connectDB from "@/configs/db";
import Payment from "@/models/Payment";
import UserSchema from "@/models/UserSchema";
import { verifyPayment } from "@/utils/zarinpal";

export async function GET(req) {
 
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const paymentId = searchParams.get("paymentId");
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    if (!paymentId || !authority) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/payment/failed`
      );
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/payment/failed`
      );
    }

    // اگر قبلاً پرداخت تایید شده باشد
    if (payment.status === "paid") {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`
      );
    }

    // اگر کاربر پرداخت را لغو کرده باشد
    if (status !== "OK") {
      payment.status = "failed";
      await payment.save();

      return Response.redirect(
  new URL("/payment/failed", req.url)
);
    }

    // تایید پرداخت با زرین پال
    const result = await verifyPayment(authority, payment.amount);

    if (result.data?.code === 100 || result.data?.code === 101) {
      payment.status = "paid";
      payment.authority = authority;
      payment.refId = result.data.ref_id;

      await payment.save();

      const user = await UserSchema.findById(payment.user);

      if (user) {
        const newCourses = payment.courses.filter(
          (courseId) =>
            !user.purchesedCourses.some(
              (id) => id.toString() === courseId.toString()
            )
        );

        if (newCourses.length > 0) {
          user.purchesedCourses.push(...newCourses);
          await user.save();
        }
      }

      return Response.redirect(
  new URL("/payment/success", req.url)
);
      
    }

    payment.status = "failed";
    await payment.save();

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/payment/failed`
    );
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/payment/failed`
    );
  }
}