import mongoose from "mongoose";


const lessonSchemaa=new mongoose.Schema({
title:{
type:String,
required:true,
trim:true
},
duration:{
type:String,// مدت زمان هر ویدیو برای هر درس
required:true
},
isfree:{
    type:Boolean,
    default:false
},
videoKey:{
   type:String,// ادرس هر ویدیو
required:true 
}

})








const chapterSchemaa=new mongoose.Schema({
title:{
type:String,
required:true,
trim:true
},
lessons:{
    type:[lessonSchemaa],
    default:[]
}

})








const courseSchemaa=new mongoose.Schema({

title:{
type:String,
required:true,
trim:true
},
slug:{
type:String,
required:true,
unique:true,
lowercase:true,
trim:true
},

shortDescription:{
    type:String,
required:true,
maxlength:300,
trim:true
},
fullDescription:{
   type:String,
required:true,
},
thumbnail:{
type:String,
required:false,  // بابت ادرس عکس
},
price:{
type:Number,
required:true

},
discountPrice:{
type:Number, // بابت تخقیف دوره
default:null
},
isfree:{
    type:Boolean,
    default:false

},
chapters:{
type:[chapterSchemaa],
default:[]


},
totalDuration:{
    type:String,//»مدت زمان کلی هر فصل
    default:""
},
lessonsCount:{
    type:Number,
    default:0
},
teacher:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:false
},
statusPeriod:{
    type:String,
    enum:["draft","published","cooming-soon"],
    default:"draft"
},
levelPeriod:{
    type:String,
    enum:["beginner","intermediad","advanced"],
    default:"beginner"
},

commentsCount:{
    type:Number,
    default:0
},

studentsCount:{
    type:Number,
     default:0
},
embedding:{
    type:[Number],
    default:[]
}








},{timestamps:true})

export default mongoose.models.Course || mongoose.model("Course",courseSchemaa)