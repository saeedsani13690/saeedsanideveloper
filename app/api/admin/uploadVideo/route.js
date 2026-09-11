import { NextResponse } from "next/server";
import { PutObjectCommand,DeleteObjectCommand  } from "@aws-sdk/client-s3";
import s3 from "@/configs/ArvanCloud"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";



// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("video");
//   const slug = formData.get("slug");        // مثل: react-course
//     const chaptertitle = formData.get("chaptertitle");  
    



//     if (!file) {
//       return NextResponse.json(
//         { success: false, message: "فایل ویدیو ارسال نشده است" },
//         { status: 400 }
//       );
//     }


//   if (!slug || !chaptertitle  ) {
//       return NextResponse.json(
//         { success: false, message: "slug، فصل و درس باید ارسال شوند" },
//         { status: 400 }
//       );
//     }



//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const fileName = `${Date.now()}-${file.name}`;
//    // مسیر فولدرها اینجاست
//     const videoKey = `${slug}/${chaptertitle}/${fileName}`;
//     await s3.send(
//       new PutObjectCommand({
//         Bucket: process.env.ARVAN_BUCKET,
//         Key: videoKey,
//         Body: buffer,
//         ContentType: file.type,
//       })
//     );

//     return NextResponse.json({
//       success: true,
//       key: videoKey,
//     });

//   } catch (error) {
//     console.dir(error, { depth: null });

//     return NextResponse.json({
//       success: false,
//       message: error.message,
//       name: error.name,
//       metadata: error.$metadata,
//       code: error.Code,
//     });
//   }
// }



// این در واقع برای ابولد ویدیو به صورت مستیم داخل اروان است 
export async function POST(req){
  try{

    // اطلاعات رو از مرورگر میگیرییم
const { slug, chaptertitle, fileName, contentType } = await req.json();
 

// والین نگهبان رو میگداریم تا کسی جانمونه 
if(!slug || !chaptertitle || !fileName || !contentType){
  return NextResponse.json({success:false,message:"همه فیلدها رو کامل نکردی "},{status:400})
}


// حالا یک اسم جدید برای فایل میخواهیم بسازیم 
const safeFileName = `${Date.now()}-${fileName}`;


// حالا ادرس داخلی ویدیو رو بساز که داخل مونگو دی بی ذخیره کنیم 
const videoKey=`${slug}/${chaptertitle}/${safeFileName}`




// حالا دستور ابولد رو میساریم 

const command = new PutObjectCommand({
  Bucket: process.env.ARVAN_BUCKET,
  Key: videoKey,
  ContentType: contentType,
});// اینجا به نگهبان میکیم که میخوایه میک فایل اینجا قرار بدم 



// حالا یک بلیز موقت یا یک ادرس موقت به کاربر بده 
const uploadUrl = await getSignedUrl(s3, command, {expiresIn: 60 * 10,});




//حالا این ادرس که ساختی به مرورگر بده 
return NextResponse.json({
  success: true,
  uploadUrl,
  videoKey,
});
  






  }catch(error){
  console.error("Presigned URL Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}



export async function DELETE(req) {
  try {
    const formData = await req.formData();

    const videoKey = formData.get("videoKey");

    if (!videoKey) {
      return NextResponse.json(
        {
          success: false,
          message: "videoKey ارسال نشده است",
        },
        { status: 400 }
      );
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.ARVAN_BUCKET,
        Key: videoKey,
      })
    );

    return NextResponse.json({
      success: true,
      message: "ویدیو با موفقیت حذف شد",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}