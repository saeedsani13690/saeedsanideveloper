import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
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

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);