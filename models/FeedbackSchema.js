import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    status: {
      type: String,
      enum: ["pending", "read"],
      default: "pending",
    },
    isReadByAdmin: {
  type: Boolean,
  default: false,
}
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Feedback ||
mongoose.model("Feedback", feedbackSchema);