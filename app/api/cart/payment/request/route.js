import connectDB from "@/configs/db";
import UserSchema from "@/models/UserSchema";
import CourseSchema from "@/models/CourseSchema";
import Payment from "@/models/Payment";
import getCurrentUser from "@/utils/getCurrentUser";
import { createPayment, getPaymentUrl } from "@/utils/zarinpal";

export async function POST(req) {
  try {
    await connectDB();
// گرفتن کاربر برای اینکه چه کسی انجام داده 
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "ابتدا وارد حساب کاربری شوید.",
        },
        {
          status: 401,
        }
      );
    }



// برای اینکه بدانیم کدام دورهها را میخواد بخره 
    const { courseIds } = await req.json();

    if (!courseIds || courseIds.length === 0) {
      return Response.json(
        {
          success: false,
          message: "هیچ دوره‌ای انتخاب نشده است.",
        },
        {
          status: 400,
        }
      );
    }


// پیدا کردن دورهها از مونگو دی بی براساس ایدی هایی که فرستادم 
    const courses = await CourseSchema.find({
      _id: { $in: courseIds },
    });
    if (courses.length === 0) {
      return Response.json(
        {
          success: false,
          message: "دوره‌ای پیدا نشد.",
        },
        {
          status: 404,
        }
      );
    }



// محاسبه مبالغ دوره با هم 
    const amount = courses.reduce(
      (sum, course) => sum + (course.discountPrice || course.price),
      0
    )*10;



// اینجا هیچ مبلغی زده نشده فقط یک دایکیمنت داریم میسازیم 
    const payment = await Payment.create({
      user: currentUser._id,
      courses: courses.map((course) => course._id),
      amount,
    });



// ارتباط با زرین پال 
//NEXT_PUBLIC_SITE_URL=https://your-domain.com برای ساتی واقعی بایدادرس دامنه خودت رو بزاری
    const callbackURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/cart/payment/verify?paymentId=${payment._id}`;

    const result = await createPayment(
      amount,
      callbackURL,
      "خرید دوره آموزشی"
    );

   
// اگر زرنی پال گفت موفق بود 
    if (result.data?.code === 100) {
      payment.authority = result.data.authority; // یک کد موقت  شناسه پرداخت زرین پال را ذخیره میکند 
      await payment.save();


// بعد اینکه اون کد موقت رو گرفتی توسط فانکشن پایین به فرانت میفرستی 
      return Response.json({
        success: true,
        paymentURL: getPaymentUrl(result.data.authority),
      });
    }

    await payment.deleteOne();

    return Response.json(
      {
        success: false,
        message:
          result.errors?.message ||
          result.errors?.validations?.merchant_id?.[0] ||
          "خطا در ایجاد درخواست پرداخت",
      },
      {
        status: 400,
      }
    );




  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "خطای سرور",
      },
      {
        status: 500,
      }
    );
  }
}