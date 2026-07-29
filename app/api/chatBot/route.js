import connectDB from "@/configs/db";
import CourseSchema from "@/models/CourseSchema";
import FaqSchema from "@/models/FaqSchema";
import UnansweredQuestion from "@/models/UnansweredQuestion";
import { askOllama,  getEmbedding} from "./openai";
import normalizeText from "./sevices/normalizeText.js"
import cosineSimilarity from "./sevices/cosineSimilarity";




///1////
// کلمه ورودی هر کاربر که احتمالا همیشه میگوید که شامل سلام است 
const greetings = [

    "سلام",
    "سلامم",
    "درود",
    "صبح بخیر",
    "وقت بخیر"

];
function greetingService(cleanMessage) {

    if (!greetings.some(item => cleanMessage.includes(item))) {
        return null;
    }

    return {

        status: true,

        replyBot:
            "سلام 🌹 خوش اومدی. هر سوالی درباره دوره‌ها، ثبت نام، قیمت یا مدرس‌ها داری بپرس."

    };

}
// اولین کاری که در چت بات اتفاق میفتد 




///2//////////
//====================================================
// جستجوی FAQ
//====================================================
const SIMILARITY_THRESHOLD = 0.85;
async function faqService(cleanMessage) {
console.log("===== FAQ SERVICE START =====");
console.log("USER MESSAGE:", cleanMessage);
   // در دیتابیس در سوالهای که توسط ادمین ساخته شده میگردیم
    const faqs = await FaqSchema.find({ status: "active"    });
    let bestFaq = null;// این متغیر برای بهتریم نتیجه
    let bestScore = 0;// امتیاز اون سوال ور نگه میدارد
    const words = cleanMessage.split(" ");// تبذیل متن به ارایه 
// این ببرسی بابت همسان بودن ذقیق سوال کاربر با سوال ادمین 
    for (const faq of faqs) {
        let score = 0;
        const question = normalizeText(faq.question);
        if(question === cleanMessage){ score += 100; }
        for(const keyword of faq.keywords){if(words.includes(  normalizeText(keyword))) score += 5; } 
        if(score > bestScore){ bestScore = score;  bestFaq = faq.answer; }
    }
// همینجا براس کلمات کلیدی. بیدا میشه 
    if(bestScore >= 10){return {  status:true,replyBot:bestFaq };
    }



    // مرحله ۲: جستجوی embeddin
    const questionEmbedding =await getEmbedding(cleanMessage);
    let embeddingFaq = null;
    let embeddingScore = 0;

    for(const faq of faqs){ if(!faq.embedding) continue;
   // این دو تا ورودی که شمال دو تا بردار است به یک فانشکن دیگه میدهیم 
const similarity =cosineSimilarity( questionEmbedding,faq.embedding );
console.log("similarity",similarity)
                    
 if(similarity > embeddingScore){ embeddingScore = similarity;embeddingFaq = faq;}
    }
 if( embeddingScore >= SIMILARITY_THRESHOLD && embeddingFaq)
  {  return  {  status:true, replyBot:embeddingFaq.answer   };
    }
    // اگر هیچ کدام نبودند در نهاییت نال برگردون 
    return null;
}
// دومین کاری که چت بات انجام میده گشتن در سوالهای چاسخ داده توسط ادمین 



///3//////
// جستجوی دوره با Embedding (RAG)
async function courseService(cleanMessage) {
const courses = await CourseSchema.find({ statusPeriod:"published"});
 // اینجا متن رو به تابه بردارذی میفرستیم 
const questionEmbedding =await getEmbedding(cleanMessage);
let results=[];
for(const course of courses){
      if(!course.embedding?.length) continue;// برای جلوگیری از کرش کردن 
      // دو تا وردی میدهیم ورودی بردار دوره وبردار چیام کاربر
const similarity =cosineSimilarity(questionEmbedding, course.embedding  );
// به ارایه نهایی دو تا دوره وامبدینگ کاربر رو میفرستیم  
results.push({course, similarity });  }
results.sort((a,b)=>b.similarity-a.similarity );// مرتب ساری براساس بالاترین بردار 
        
   const bestCourses = results
   .filter(item=>item.similarity >= 0.80)
    .slice(0,5)
    .map(item=>item.course);
  if(!bestCourses.length){ return null;    }
return {status:true, replyBot:"این دوره‌ها ممکن است برای شما مناسب باشند 👇",courses:bestCourses };

}
// سومین کاری که جت بات انجام میده 






// ///4/////
function isGeneralProgrammingQuestion(text) {
// کلمات کلید عمومی برای تشخیص این که مربوط به سایت است
   const keywords = [
    "چیست",
    "یعنی چه",
    "چه کاربردی دارد",
    "چه استفاده‌ای دارد",
    "چرا استفاده می‌شود",
    "چگونه کار میکند",
    "چطوری کار میکند",
    "توضیح بده",
    "معرفی کن",
    "فرق",
    "تفاوت",
    "مقایسه"
];
// یکی از کلمات بالا هم باشد به عنوان سوال اموزشی شناخته میشود 
// پس میره برای پاسخ هوش مصنوعی
    return keywords.some(item =>
        text.includes(item)
    );
}
/// چهارمین کاری که چت بات انجام میدهد برای رفتن به هوش مصنوعی یا نرود 







async function saveUnansweredQuestion(message, cleanMessage) {

    const embedding = await getEmbedding(cleanMessage);

    const questions = await UnansweredQuestion.find({
        status: "pending"
    });

    let bestQuestion = null;
    let bestSimilarity = 0;

    for (const question of questions) {

        if (!question.embedding?.length) {
            continue;
        }

        const similarity = cosineSimilarity(
            embedding,
            question.embedding
        );

        if (similarity > bestSimilarity) {

            bestSimilarity = similarity;
            bestQuestion = question;

        }

    }

    if (
        bestQuestion &&
        bestSimilarity >= SIMILARITY_THRESHOLD
    ) {

        bestQuestion.count += 1;

        await bestQuestion.save();

        return bestQuestion;

    }

    return await UnansweredQuestion.create({

        question: message,

        normalizedQuestion: cleanMessage,

        embedding

    });

}

// موضاعات مربوط به سایت اگر غیر اینها باشه بگه موضوع مربوط نیست
const allowedTopics = [

    "دوره",
    "آموزش",
    "برنامه نویسی",
    "برنامه‌نویسی",
    "برنامه نویس",
    "جاوااسکریپت",
    "javascript",
    "react",
    "ریکت",
    "next",
    "نکست",
    "node",
    "نود",
    "mongodb",
    "دیتابیس",
    "ثبت نام",
    "خرید",
    "قیمت",
    "مدرس"

];
//====================================================
// تشخیص مربوط بودن سؤال به سایت
//====================================================
function isRelatedToSite(text) { return allowedTopics.some(item =>text.includes(item));
}

export async function POST(req) {
    try {
await connectDB();
// این در واقه اگر بیامی کلا نیامد یک هشدر درست بدهیم
const { message } = await req.json();
if(!message){
 return Response.json({
  status:false,
  message:"پیام خالی است"
 },{
 status:400
 })
}
const cleanMessage = normalizeText(message);
// برای تشخیص اینه سوال حداقل یک کلمه نباشد 
const words = cleanMessage.split(" ").filter(Boolean);
// این متغیر برای جواب دادن سلام به کاربر است 
const greeting = greetingService(cleanMessage);
if (greeting) {
    return Response.json(greeting);
}
// این برای جلوگیری از کلمات تک کلمه هستند 
if(words.length=== 1){
    return Response.json({
        status:true,
        replyBot:"لطفاً سوال خود را واضح‌تر و کامل‌تر بنویسید."
    });
}
// FAQ
const faq = await faqService(cleanMessage);
if (faq) {
    return Response.json(faq);
}
// Course
const course = await courseService(cleanMessage);
if (course) {
    return Response.json(course);
}



// سوالات مربوط به هوش مصنوعی
if (  isGeneralProgrammingQuestion(cleanMessage)){
const aiReply = await askOllama(`
تو یک مدرس برنامه نویسی هستی.
قوانین:
- فقط فارسی روان جواب بده.
- جواب آموزشی و ساده بده.
- اگر سوال درباره برنامه نویسی بود توضیح بده.
- اطلاعات جعلی تولید نکن.
- جواب کوتاه باشد.
-اگر یک سوال رو بلد نیستی مجبور نیستی جواب بدهی فقط بگو در دانش من نیست 
اگر سؤال خارج از برنامه نویسی بود بگو:
این سؤال خارج از حوزه تخصص من است.

اگر پاسخ را نمی‌دانی حدس نزن.

مثال نادرست تولید نکن.

از Markdown استفاده نکن.

پاسخ کمتر از ۱۵۰ کلمه باشد.
سوال:
${cleanMessage}
`);
return Response.json({ status:true, replyBot:aiReply});}


    

// سؤال نامرتبط
if (!isRelatedToSite(cleanMessage)) {
return Response.json({status: true, replyBot:   "من فقط درباره دوره‌ها، آموزش برنامه‌نویسی و خدمات سایت می‌توانم کمک کنم."});  
}





// ذخیره سؤال بدون پاسخ
await saveUnansweredQuestion( message, cleanMessage);
return Response.json({status: true,
replyBot:
        "متأسفانه پاسخ این سؤال در اطلاعات سایت موجود نیست. سوال شما ثبت شد و بعد از بررسی به بخش سوالات سایت اضافه خواهد شد."
});

    } 
    catch (error) {
        console.log("CHATBOT ERROR:", error);
        return Response.json(
            {status: false, message: "خطا در سرور"},
             {  status: 500  } ); }
}












