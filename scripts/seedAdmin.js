// برای شماره کارفرما برای ادمین
// دستور npm run sedd:admin
// در اسکریپت نوشته شده 
// قبل  از دیپلوی دستور توسط برنامه نویس زده شود 

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

import connectDB from "../configs/db.js"
import UserSchema from "../models/UserSchema.js"


async function seedAdmin() {
  try {
    await connectDB();

    const phone = "09157060293";

    if (!phone) {
      throw new Error("ADMIN_PHONE is missing");
    }

    let admin = await UserSchema.findOne({ phone });

    if (!admin) {
      admin = await UserSchema.create({
        phone,
        role: "admin",
        name:"سعید",
        isverified: true,
      });

      console.log("✅ Admin user created");
    } else {

      admin.role = "admin";
      admin.name="سعید";
      admin.isverified = true;

      await admin.save();

      console.log("✅ Existing user promoted to admin");
    }

    process.exit(0);

  } catch (error) {
    console.log("❌ Seed error:", error.message);
    process.exit(1);
  }
}

seedAdmin();