import connectToDb from "@/configs/db"
import UserSchema from "@/models/UserSchema"
import { NextResponse } from "next/server"

// تابع اعتبار سنجی موبایل
const validatePhoneNumber = (phone) => /^09\d{9}$/.test(phone)

export async function POST(req) {
    try {
        // کشیدن تلفن از رکویست   
        const { phone } = await req.json()
        
        // اعتبار سنجی موبایل
        if (!phone) {
            return NextResponse.json(
                { success: false, message: "phone number is required" },
                { status: 400 }
            )
        }

        if (!validatePhoneNumber(phone)) {
            return NextResponse.json(
                { success: false, message: "invalid phone Number" },
                { status: 400 }
            )
        }

        await connectToDb()

        // پیدا کردن کاربر (find یک آرایه برمی‌گرداند)
        const users = await UserSchema.find({ phone })
        const user = users.length > 0 ? users[0] : null
        
        // بررسی OTP فعال
        if (user && user.otp && user.otp.expiresAt) {
            const expiresAtDate = new Date(user.otp.expiresAt)
            const now = new Date()

            // زمان باقیمناده تایمر و اعتبار کد رو میفرسته 
            const remainingTime=Math.ceil((expiresAtDate-now)/1000) 
            if (expiresAtDate > now) {
                return NextResponse.json(
                    { 
                        success: false, 
                        message: "کد قبلی اعتبار دارد لطفا کد  را وارد کنید " ,
                        remainingTime
                    },
                    { status: 429 }
                )
            }
        }

        // تولید یک رمز جدید 
        const otpCode = Math.floor(Math.random() * 90000) + 10000
// زمان کل اعتبار 
        const OTP_EXPIRE_SECONDS = 120;
const expiresAt = Date.now() + OTP_EXPIRE_SECONDS * 1000;
       
        
        // ارسال پیامک از طریق پنل خودم
        // const response = await fetch("https://api.sms.ir/v1/send/verify", {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'text/plain',
        //         'x-api-key': process.env.X_API_KEY
        //     },
        //     method: "POST",
        //     body: JSON.stringify({
        //         "mobile": phone,
        //         "templateId": process.env.TEMPLATE_ID,
        //         "parameters": [
        //             { name: 'code', value: otpCode },
        //         ],
        //     }),
        // })

        const response = 200 // برای تست
        
        if (response === 200) {
            // اگر کاربر از قبل وجود داشته
            if (user) {
                user.otp = {
                    code: otpCode,
                    expiresAt: new Date(expiresAt)
                }
                await user.save()
            } 
            // اگر کاربر جدید بود 
            else {
                await UserSchema.create({
                    phone,
                    otp: {
                        code: otpCode, 
                        expiresAt: new Date(expiresAt)
                    }
                })
            }




            return NextResponse.json(
                { success: true, message: "کد به شماره شما ارسال شد   ",remainingTime: OTP_EXPIRE_SECONDS },
                { status: 200 }
            )
        } else {
            return NextResponse.json(
                { success: false, message: "Failed to send OTP" },
                { status: 500 }
            )
        }

    } catch (error) {
        console.log("Server error:", error)
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        )
    }
}