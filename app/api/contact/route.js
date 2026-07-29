import connectDB from "@/configs/db";
import ContactSchema from "@/models/ContactSchema";



export async function POST(req){
try{
await connectDB()
// مقادیر که کاربر برای نظرسنجی فرستاده میگیریم 
 const { name, email, subject, message } = await req.json();

 if(!name || !email || !subject || !message){
    return Response.json(
{success:false,message:"تمام فیلدها رو لطفا بر کنید "},
{status:400}

    )
 }

 await ContactSchema.create({name,  email,subject,  message, })
    
   return Response.json({
      success: true,
      message: "پیام شما با موفقیت ثبت شد.",
    });   
}



catch(error){
 return Response.json(
      { success: false,message: "خطا در ثبت پیام.",   },
        {status: 500, } )  
}
}