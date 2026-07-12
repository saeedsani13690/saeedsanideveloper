import mongoose from "mongoose";

export default async function connectDB() {
  try {
    // چک کردن وضعیت اتصال صحیح
    if (mongoose.connection.readyState >= 1) {
      console.log("MongoDB already connected");
      return;
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");

  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // برای production: process.exit(1);
  }
}