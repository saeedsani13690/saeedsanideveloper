// این apiبرای گرفتن نمودار  ثبت نامی در هر ماه 
import connectDB from "@/configs/db";
import UserSchema from "@/models/UserSchema";

export async function GET() {

    try{

await connectDB()
// براساس این متد عملییات محاسباتی بری نمودار انجام بده 
 const usersChart = await UserSchema.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },

          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);


// برای تبذیل اون به یک ارایه ترب لازم داریم
    const months = [
  "",
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];


const chartData=usersChart.map((item)=>(
{
    month:months[item._id.month],
users:item.count,
year:item._id.year


}


))



 return Response.json( {success: true,  chartData},{ status: 200 }    );
     
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