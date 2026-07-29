"use client"

import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import style from "./question.module.css"
import toast from "react-hot-toast";
import Error from "next/error";
import PaginationQuestion from "@/app/components/pagination/paginationQuestion";



export default function Questioncreate(){

const [question, setQuestion] = useState("");
const [unansweredQuestions, setUnansweredQuestions] = useState([]);
const [answer, setAnswer] = useState("");
const [keywords, setKeywords] = useState("");
const [questions, setQuestions] = useState([]);
const [editingId, setEditingId] = useState(null);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);
const [limit] = useState(5);
const[pageunanswer,setPageunanswer]=useState(1);
const[totalpageunanswer,setTotalpageunanswer]=useState(0)


// این استیت برای این است که به کدام سوال داریم چاسخ میدهیم 
const [selectedUnansweredId, setSelectedUnansweredId] = useState(null);

// برای گرفتن سوالات 
useEffect(()=>{getquestion();getunanswerQuestion();    },[page,pageunanswer])
// برای پاک کردن سوالات 
const handelDelete=async(id)=>{
const ok = confirm("از حذف این سوال مطمئن هستید؟");
if(!ok) return 
try{
const response=await fetch(`/api/admin/questioncreate/${id}`,{method:"DELETE"})
const data=await response.json()
 if (!response.ok) {

            throw new Error(data.message);

        }
 toast.success(data.message);
getquestion()
}

catch(error){
 toast.error(error.message);
}


}

const haneleditqustion=(item)=>{
setEditingId(item._id)
 setQuestion(item.question);
    setAnswer(item.answer);
    setKeywords(item.keywords.join(","));
}
//گرفتن سوالات بی چاسخ توسط هوش مصنوعی 
const getunanswerQuestion=async()=>{
try{
const response=await fetch(`/api/admin/unanswerquestion?page=${pageunanswer}&limit=${limit}`)
const data=await response.json()
console.log(data)
if(data.success){
setUnansweredQuestions(data.question)
setTotalpageunanswer(data.totalpage)



} 
}
catch(error){
console.log(error);
}

}

// برای گرفتن سوالات برا ادمین 
const getquestion=async()=>{
try{
const response=await fetch(`/api/admin/questioncreate?page=${page}&limit=${limit}`)
const data=await response.json()
if(data.success){
    setQuestions(data.questions);
    setTotalPages(data.totalPages)
}

}
catch(error){
console.log(error);
}
}
// برا ی ارسال سوالات 
const handleSubmit=async(e)=>{
   e.preventDefault();

 try{
    // برای اینکه بدانیم کدام رکویست بدهیم 
const url=editingId
? `/api/admin/questioncreate/${editingId}`:"/api/admin/questioncreate";
const method=editingId?"PUT":"POST"




const response=await fetch(url,{

    method,
     headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({question,

                answer,

                keywords: keywords
                    .split(/[,\s]+/)
                    .map(item => item.trim())
                    .filter(Boolean)})

})

const data=await response.json()

if(data.success){
    setQuestion("");
    setAnswer("");
    setKeywords("");
    setEditingId(null);
    toast.success(editingId?"سوال شما اپدیت شد ":"سوال شما بارگزاری شد ")
    await getquestion()
}

if (!response.ok) {throw new Error(data.message);}



//  و ان را باک کند این شرط برای این است که ادمین داره سوال بیچاسهخا جوب میدهد
if(selectedUnansweredId){
    await fetch(`/api/admin/unanswerquestion/${selectedUnansweredId}`,
        {method:"DELETE"}
    )
     setSelectedUnansweredId(null);
     toast.success(" سوال کاربر  باسخ داده شد")
     // اینچا بس از باک کردن دوباه رندر کن 
      await getunanswerQuestion();
      
}
 }
 
 catch(error){
    toast.error(error.message)
 }
}
// برای چاسخ دادن به سوال بی جواب توسط هوش مصنوعی
const handleAnswerQuestion=(item)=>{
     setEditingId(null);
      setSelectedUnansweredId(item._id);
       setQuestion(item.question);
        setAnswer("");
        setKeywords("");
        window.scrollTo({top:0,behavior:'smooth'})

}
//برای باک کردن سوال کاربران که شاید بی ربط باشد 
const handleeDeleteQuestion=async(id)=>{
    const ok=confirm("ایا از حذف سوال کاربر مطیمن هستید ")
if(!ok) return;
try{
const response=await fetch(`/api/admin/unanswerquestion/${id}`,{
    method:"DELETE"
})
const data=await response.json()
if(!response.ok) throw new Error(data.message)
    toast.success("سوال کاربر حذف شد")
await getunanswerQuestion();
}
catch(error){
toast.error(error.message);
}



}



    return(
        <>
        <section className={style.section}>
<Container>
    {/* فرم ادمین برای سوال ساختن  */}
<div className={style.wrapper}>
<div className={style.header}>
<h2>ایجاد سوال جدید </h2>
<p>سوالات متداول سایت را ثبت کنید تا ربات بتواند به کاربران پاسخ دهد.</p>             
</div>
<form onSubmit={handleSubmit} className={style.form}> 




<label className={style.label}> سوال</label>       
<input
    className={style.input}
    type="text"
    placeholder="مثلاً: قیمت دوره جاوااسکریپت چقدر است؟"
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
/>


<label className={style.label}> جواب</label>
<textarea
    className={style.textarea}
    placeholder="پاسخ سوال را وارد کنید..."
    value={answer}
    onChange={(e) => setAnswer(e.target.value)}
/>




 <label className={style.label}> کلمات کلیدی </label>  
<input
    className={style.input}
    type="text"
    placeholder="قیمت,هزینه,شهریه"
    value={keywords}
    onChange={(e) => setKeywords(e.target.value)}
/>


<button className={style.button}   type="submit">
 {editingId ? "بروزرسانی سوال" :selectedUnansweredId?"ثبت باسخ": "ثبت سوال"}
</button>
    </form> 
</div>

{/* سوالات مه ادمین خودش میسازد */}
<div className={style.tableWrapper}>

    <table className={style.table}>
        <thead>
            <tr>
                <th>ردیف</th>
                <th>سوال</th>
                <th>کلمات کلیدی</th>
                <th>عملیات</th>
            </tr>
        </thead>



<tbody>
 { questions.length === 0 ? (<tr> 
    <td colSpan={4} className={style.empty}> هنوز سوالی ثبت نشده است. </td>
     </tr> ) 
 :
 ( questions.map((item, index) => (
                        <tr key={item._id}>
                            <td>{index + 1}</td>
                        <td className={style.question}> {item.question}</td>
                               
                            

<td>
    <div className={style.keywordBox}>
 { item.keywords.map((keyword, i) => (<span key={i}   className={style.keyword}>  {keyword}  </span> )) }
    </div>        
</td>

<td>
     <div className={style.actions}>
    <button onClick={()=>haneleditqustion(item)}    className={style.editBtn}  > ویرایش </button>
    <button onClick={()=>handelDelete(item._id)}   className={style.deleteBtn}  >   حذف</button>
     </div>
</td>
            </tr>
                    )) )}

 </tbody>
</table>
</div>
{/* صفحه بندی برای سوالات ادمین */}
<PaginationQuestion 
 page={page}
    totalPages={totalPages}
    setPage={setPage}
/>


{/* سوالات بیچاسخ کاربر */}
<div className={style.tableWrapper}>
<h3>سوالات بی‌پاسخ چت‌بات</h3>
<table className={style.table}>


<thead>
<tr>
    <th>ردیف</th>
     <th>سوال</th> 
     <th>تعداد</th>
    <th>عملیات</th>
</tr>
</thead>

<tbody>
     {unansweredQuestions.length === 0 ? 

   ( <tr>
    <td colSpan={4}>  سوال بی‌پاسخی وجود ندارد. </td>
    </tr>) 
 : 
 (unansweredQuestions.map((item, index) => (
         <tr key={item._id}>
             <td>{index + 1}</td>
             <td>{item.question}</td>
             <td>{item.count}</td>
            <td>
 <div className={style.actions}>
    <button onClick={()=>handleAnswerQuestion(item)}  className={style.editBtn}> باسخ دادن  </button>
    <button onClick={()=>handleeDeleteQuestion(item._id)}  className={style.deleteBtn} > حذف</button>
 </div>                       
           </td>
        </tr>  )) ) }
 </tbody>
</table>
</div>

<PaginationQuestion 
 page={pageunanswer}
    totalPages={totalpageunanswer}
    setPage={setPageunanswer}
/>





</Container>
</section>
        
       
        </>
    )
}