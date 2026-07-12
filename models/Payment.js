import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

   authority: {
  type: String,
  unique: true,
  sparse: true,
},

    refId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);