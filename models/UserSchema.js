import mongoose  from "mongoose";



const UserSchema=new mongoose.Schema({
phone:{
    type:String,
    required:true,
    unique:true,
    trim:true

},

email:{
type:String,
default:null,
lowercase:true,
    trim:true
},
name:{
    type:String,
      trim:true,
      default:"",
      maxLength:50
},
role:{
    type:String,
    enum:["user","admin"],
    default:"user"
},
otp:{
code:{type:String},
expiresAt:{type:Date}


},

isverified:{
    type:Boolean,
    default:false
},
purchesedCourses:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"Course",
default:[]
}
],
lastLoginAt:{
    type:Date
},
refreshToken:{
    type:String
},
profileImage: {
    type: String,
    default: ""
},


},
{timestamps:true}
)
export default mongoose.models.User || mongoose.model("User",UserSchema)