import mongoose from "mongoose";


const replySchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);





const commentSchema = new mongoose.Schema(
  {
    // متن کامنت
    body: {
      type: String,
      required: true,
      trim: true,
    },

    // کاربری که کامنت را ثبت کرده
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // دوره‌ای که کامنت برای آن ثبت شده
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // امتیاز کاربر به دوره (1 تا 5)
    score: {
      type: Number,
      min: 1,
      max: 5,
      
    },

    // وضعیت تایید کامنت توسط ادمین
    status: {
  type: String,
  enum: [
    "pending",
    "approved",
    "rejected"
  ],
  default: "pending"
},

    // اگر کامنت پاسخ به کامنت دیگری باشد
    // شناسه کامنت والد در اینجا ذخیره می‌شود
   replies: [replySchema],
  },
  {
    // ایجاد خودکار createdAt و updatedAt
    timestamps: true,
  }
);

const Comment =
  mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema);

export default Comment;

