import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

  

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
     embedding:{
    type:[Number],
    required:true
 },

   

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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

export default mongoose.models.Faq ||
mongoose.model("Faq", FaqSchema);