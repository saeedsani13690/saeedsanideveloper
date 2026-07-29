import mongoose from "mongoose";



const orderItemSchemaa=new mongoose.Schema(
{
course:{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
required:true
},
price:{
type:Number,
required:true,
min:0

}





}





)








const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchemaa],
      required: true,
    },


   totalprice: {
      type: Number,
      required: true,
      min:0
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed","cancelled"],
      default: "pending",
    },

paymentMethod:{
  type:String,
  default:"zarinpal"
},
authority:{
  type:String,
  default:null

},
// این بابت شماره بیگری بس از برداخت است 
refId:{
  type:String,
  default:null
},
// این هم ساعت برداخت است 
paidAt:{
  type:Date,
  default:null

}
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);