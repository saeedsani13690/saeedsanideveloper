import mongoose from "mongoose";

const unansweredQuestionSchema = new mongoose.Schema({

    question:{
        type:String,
        required:true,
        trim:true
    },

    normalizedQuestion:{
        type:String,
        required:true,
        unique:true
    },

    count:{
        type:Number,
        default:1
    },

    status:{
        type:String,
        enum:["pending","answered"],
        default:"pending"
    },
    embedding: {
    type: [Number],
    required: true
},
isReadByAdmin: {
  type: Boolean,
  default: false,
}

},{
    timestamps:true
});

export default mongoose.models.UnansweredQuestion ||
mongoose.model("UnansweredQuestion", unansweredQuestionSchema);