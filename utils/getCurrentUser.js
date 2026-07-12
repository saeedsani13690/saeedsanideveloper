import connectDB from "@/configs/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import UserSchema from "@/models/UserSchema";
export default async function getCurrentUser() {
  await connectDB();

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  const payload = jwt.verify(
    accessToken,
    process.env.ACCEST_TOKEN_SECRET
  );

  const user = await UserSchema.findById(payload.userId);

  return user;
}