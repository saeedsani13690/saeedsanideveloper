import connectDB from "@/configs/db";
import Course from "@/models/CourseSchema";
import { NextResponse } from "next/server";
import { IsAdmin } from "@/utils/authIsAdminTrueOrFales";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

export async function POST(req) {
  try {
    // اتصال به دیتابیس
    await connectDB();

    // بررسی اینکه درخواست‌کننده ادمین است یا نه
    const authIsAdmin = IsAdmin(req);

    if (!authIsAdmin.isAdmin) {
      return authIsAdmin;
    }

    // دریافت FormData
    const formData = await req.formData();

    if (!formData) {
      return NextResponse.json(
        {
          success: false,
          message: "هیچ فرمی وارد نکردی",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // دریافت اطلاعات فرم
    // =========================

    const title = formData.get("title");
    const slug = formData.get("slug");
    const shortDescription = formData.get("shortDescription");
    const price = formData.get("price");
    const discountPrice = formData.get("discountPrice");

    const isfree = formData.get("isfree") === "true";

    const levelPeriod =
      formData.get("levelPeriod") || "beginner";

    const statusPeriod =
      formData.get("statusPeriod") || "draft";

    const fullDescription = formData.get("fullDescription");

    const thumbnail = formData.get("thumbnail");

    const chaptersJSON = formData.get("chapters");

    // =========================
    // تبدیل و اعتبارسنجی فصل‌ها
    // =========================

    let chapters = [];

    if (chaptersJSON) {
      try {
        // تبدیل رشته JSON به آرایه واقعی
        chapters = JSON.parse(chaptersJSON.toString());

        // بررسی اینکه حداقل یک فصل وجود داشته باشد
        if (!Array.isArray(chapters) || chapters.length === 0) {
          return NextResponse.json(
            {
              success: false,
              message: "حداقل یک فصل لازم است",
            },
            {
              status: 400,
            }
          );
        }

        // بررسی تک‌تک فصل‌ها
        for (const chapter of chapters) {
          // عنوان فصل
          if (!chapter.title?.trim()) {
            return NextResponse.json(
              {
                success: false,
                message: "عنوان هر فصل الزامی است",
              },
              {
                status: 400,
              }
            );
          }

          // بررسی وجود lessons
          if (
            !Array.isArray(chapter.lessons) ||
            chapter.lessons.length === 0
          ) {
            return NextResponse.json(
              {
                success: false,
                message: "حداقل یک درس برای هر فصل لازم است",
              },
              {
                status: 400,
              }
            );
          }

          // بررسی تک‌تک درس‌ها
          for (const lesson of chapter.lessons) {
            // عنوان درس
            if (!lesson.title?.trim()) {
              return NextResponse.json(
                {
                  success: false,
                  message: "عنوان هر درس الزامی است",
                },
                {
                  status: 400,
                }
              );
            }

            // مدت زمان درس
            if (!lesson.duration?.trim()) {
              return NextResponse.json(
                {
                  success: false,
                  message: "مدت زمان هر درس الزامی است",
                },
                {
                  status: 400,
                }
              );
            }

            // ویدیوی درس
            if (!lesson.videoKey?.trim()) {
              return NextResponse.json(
                {
                  success: false,
                  message: "ویدیو هر درس الزامی است",
                },
                {
                  status: 400,
                }
              );
            }
          }
        }
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            message: "فرمت درس‌ها و فصل‌ها نامعتبر است",
          },
          {
            status: 400,
          }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "فصل‌های دوره الزامی هستند",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // اعتبارسنجی اطلاعات فرم
    // =========================

    // بررسی تصویر
    if (!thumbnail || !(thumbnail instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "تصویر دوره الزامی است",
        },
        {
          status: 400,
        }
      );
    }

    // بررسی عنوان
    if (!title || title.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: "عنوان دوره باید حداقل 5 کاراکتر باشد",
        },
        {
          status: 400,
        }
      );
    }

    // بررسی توضیحات کامل
    if (!fullDescription || fullDescription.trim().length < 50) {
      return NextResponse.json(
        {
          success: false,
          message: "توضیحات کامل باید حداقل 50 کاراکتر باشد",
        },
        {
          status: 400,
        }
      );
    }

    // بررسی slug
    if (!slug || !slug.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug معتبر وارد کنید",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // بررسی تکراری نبودن slug
    // =========================

    const existingSlug = await Course.findOne({ slug });

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "این slug قبلاً انتخاب شده است",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // ذخیره Thumbnail
    // =========================

    // گرفتن اطلاعات خام فایل
    const bytes = await thumbnail.arrayBuffer();

    // تبدیل اطلاعات خام به Buffer
    const buffer = Buffer.from(bytes);

    // گرفتن پسوند فایل
    const fileExtension = path.extname(thumbnail.name);

    // ساخت اسم جدید و تصادفی
    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${fileExtension}`;

    // مسیر پوشه ذخیره عکس‌ها
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "images",
      "courses"
    );

    // اگر پوشه وجود نداشت، آن را بساز
    await mkdir(uploadDir, {
      recursive: true,
    });

    // ساخت مسیر کامل فایل
    const filePath = path.join(uploadDir, filename);

    // ذخیره واقعی عکس
    await writeFile(filePath, buffer);

    // آدرس قابل استفاده عکس در سایت
    const imageUrl = `/images/courses/${filename}`;

    // =========================
    // محاسبه مدت کل دوره
    // =========================

    let totalMinutes = 0;

    chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        const [minutes, seconds] = lesson.duration
          .split(":")
          .map(Number);

        totalMinutes += minutes;
        totalMinutes += seconds / 60;
      });
    });

    // تبدیل کل دقیقه به ساعت
    const hours = Math.floor(totalMinutes / 60);

    // گرفتن دقیقه‌های باقی‌مانده
    const minutes = Math.round(totalMinutes % 60);

    // ساخت متن مدت دوره
    const totalDuration = `${hours} ساعت و ${minutes} دقیقه`;

    // =========================
    // محاسبه تعداد کل درس‌ها
    // =========================

    const lessonsCount = chapters.reduce(
      (sum, chapter) => sum + chapter.lessons.length,
      0
    );

    // =========================
    // ساخت دوره جدید
    // =========================

    const newCourse = new Course({
      title,
      slug,
      shortDescription,
      fullDescription,

      // اگر رایگان بود قیمت صفر
      price: isfree ? 0 : Number(price),

      // اگر تخفیف داشت عددش را ذخیره کن
      // اگر نداشت null
      discountPrice: discountPrice
        ? Number(discountPrice)
        : null,

      isfree,

      levelPeriod,
      statusPeriod,

      // آدرس عکس
      thumbnail: imageUrl,

      // فصل‌ها و درس‌ها
      chapters,

      // تعداد کل درس‌ها
      lessonsCount,

      // مدت کل دوره
      totalDuration,
    });

    // =========================
    // ذخیره دوره در MongoDB
    // =========================

    await newCourse.save();

    // =========================
    // پاسخ موفقیت
    // =========================

    return NextResponse.json(
      {
        success: true,
        message: "دوره با موفقیت اضافه شد",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}