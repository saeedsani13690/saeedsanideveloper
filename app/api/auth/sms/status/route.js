import UserSchema from "@/models/UserSchema";
import connectDB from "@/configs/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const user = await UserSchema.findOne({ phone });

    // اگر کاربر یا OTP وجود نداشت
    if (!user || !user.otp || !user.otp.expiresAt) {
      return NextResponse.json(
        {
          success: true,
          hasActiveOtp: false,
          remainingTime: 0,
        },
        {
          status: 200,
        }
      );
    }

    const now = new Date();
    const expiresAt = new Date(user.otp.expiresAt);

    // اگر OTP منقضی شده باشد
    if (expiresAt <= now) {
      return NextResponse.json(
        {
          success: true,
          hasActiveOtp: false,
          remainingTime: 0,
        },
        {
          status: 200,
        }
      );
    }

    // اگر OTP هنوز معتبر است
    const remainingTime = Math.ceil((expiresAt - now) / 1000);

    return NextResponse.json(
      {
        success: true,
        hasActiveOtp: true,
        remainingTime,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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