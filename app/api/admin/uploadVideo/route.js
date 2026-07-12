import { NextResponse } from "next/server";
import { PutObjectCommand,DeleteObjectCommand  } from "@aws-sdk/client-s3";
import s3 from "@/configs/ArvanCloud"



export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("video");
  const slug = formData.get("slug");        // مثل: react-course
    const chaptertitle = formData.get("chaptertitle");  
    



    if (!file) {
      return NextResponse.json(
        { success: false, message: "فایل ویدیو ارسال نشده است" },
        { status: 400 }
      );
    }


  if (!slug || !chaptertitle  ) {
      return NextResponse.json(
        { success: false, message: "slug، فصل و درس باید ارسال شوند" },
        { status: 400 }
      );
    }



    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
   // مسیر فولدرها اینجاست
    const videoKey = `${slug}/${chaptertitle}/${fileName}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.ARVAN_BUCKET,
        Key: videoKey,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return NextResponse.json({
      success: true,
      key: videoKey,
    });

  } catch (error) {
    console.dir(error, { depth: null });

    return NextResponse.json({
      success: false,
      message: error.message,
      name: error.name,
      metadata: error.$metadata,
      code: error.Code,
    });
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