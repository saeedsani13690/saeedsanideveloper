import connectDB from "@/configs/db";
import FaqSchema from "@/models/FaqSchema";

// برای گرفتن اطلاعات یک سوال 
export async function GET(req,{params}) {
    
try{
await connectDB()
const que=await FaqSchema.findById(params.id)

if(!que){
    return Response.json(
{success:false,message:"سوال پدا نشد "},
{status:404}
   
    )
}


 return Response.json({
            success:true,
            que
        });



}

catch(error){
 return Response.json(
            {
                success:false,
                message:"خطا در سرور"
            },
            {
                status:500
            }
        );
}

}


export async function PUT(req,{params}){

    try{

        await connectDB();
        const {id}=await params
        const body = await req.json();
        const faq = await FaqSchema.findByIdAndUpdate(
            id,
            body,

            {
                new:true
            }

        );

        if(!faq){

            return Response.json(
                {
                    success:false,
                    message:"سوال پیدا نشد."
                },
                {
                    status:404
                }
            );

        }

        return Response.json({
            success:true,
            faq
        });

    }

    catch(error){

        return Response.json(
            {
                success:false,
                message:"خطا در سرور"
            },
            {
                status:500
            }
        );

    }

}

export async function DELETE(req,{params}){

    try{

        await connectDB();
const{id}=await params
        const faq = await FaqSchema.findByIdAndDelete(id);
        

        if(!faq){

            return Response.json(
                {
                    success:false,
                    message:"سوال پیدا نشد."
                },
                {
                    status:404
                }
            );

        }

        return Response.json({

            success:true,

            message:"سوال حذف شد."

        });

    }

    catch(error){

        return Response.json(
            {
                success:false,
                message:"خطا در سرور"
            },
            {
                status:500
            }
        );

    }

}


