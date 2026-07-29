import { NextResponse } from "next/server";
import connectDB from "@/configs/db";
import FeedbackSchema from "@/models/FeedbackSchema";

export async function GET() {
  try {
    await connectDB();

    const stats = await FeedbackSchema.aggregate([
      {
        // فکت باعث میشه سه تا کویری همزمان بزنیم و جدا جدا
        $facet: {
          // تعداد کل بازخوردها و میانگین امتیاز
          overview: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                average: { $avg: "$rating" },
              },
            },
          ],

          // با ستاره  تعداد هر امتیاز
          stars: [
            {
              $group: {
                // براسس این فیلد گروه بندی کن 
                _id: "$rating",
                count: { $sum: 1 },
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
          ],
        },
      },
    ]);
// این مقدار اولیه میانگین  . جمع انها رو داخل خودش نگه میدارد 
    const overview = stats[0].overview[0] || {
      total: 0,
      average: 0,
    };




    const starsMap = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    stats[0].stars.forEach((item) => {
      starsMap[item._id] = item.count;
    });

    const happy = starsMap[4] + starsMap[5];// رضایت مشتری
    const normal = starsMap[3];// معمولی
    const sad = starsMap[1] + starsMap[2];//ناراحتی مشتری


// درصد رضایت مشتریان رو بدست میاریم 
    const pie = {
      happy:
        overview.total === 0
          ? 0
          : Math.round((happy / overview.total) * 100),

      normal:
        overview.total === 0
          ? 0
          : Math.round((normal / overview.total) * 100),

      sad:
        overview.total === 0
          ? 0
          : Math.round((sad / overview.total) * 100),
    };



    return NextResponse.json({

      total: overview.total,// کل بازخوردها
      average: Number(overview.average.toFixed(1)),// میانگین با دو تا اعشار
      pie,
      stars: [
        { star: "1", count: starsMap[1] },
        { star: "2", count: starsMap[2] },
        { star: "3", count: starsMap[3] },
        { star: "4", count: starsMap[4] },
        { star: "5", count: starsMap[5] },//حالا فرانت‌اند همیشه یک آرایه با ۵ آیتم ثابت دریافت می‌کند.
      ],
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "خطای سرور",
      },
      {
        status: 500,
      }
    );
  }
}