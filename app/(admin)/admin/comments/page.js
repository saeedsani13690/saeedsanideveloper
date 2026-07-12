"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Container, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";

export default function Comments() {
  const [comments, setComments] = useState([]);
  
 
 const [statuscommnet, setStatuscommnet] =  useState("");
const [search, setSearch] =  useState("");

//برای پاک کردن کامنت است 
const deleteComment=async(id)=>{
  
const isconfirme=confirm("ایا از حذف این کامنت مطمین هستید ")
if(!isconfirme) return 



try{
const response=await fetch(`/api/admin/comment/updatecomment/${id}`,{
  method:"DELETE",

})

const data=await response.json()

if(data.success){ toast.success("کامنت با موفقیت پاک شد د")
setComments((prevComment)=>prevComment.filter((comment)=>comment._id!==id))
}
else{
toast.error(data.message)
}

}
catch(error){
 toast.error(error.message);
}

}


//برای تایید یا رد کردن یک کامنت
const updateComment=async(id,status)=>{
try{
const response=await fetch(`/api/admin/comment/updatecomment/${id}`,{

method:"PATCH",
headers:{"Content-Type": "application/json"},
body:JSON.stringify({status})

})

const data=await response.json()
if (data.success) {
      toast.success(data.message)

setComments((prevcomment)=>prevcomment.map((comment)=>comment._id===id
?{...comment,status}:comment
))

}else{
 toast.error(data.message);
}

}
catch(error){
toast.error(error.message);
}

}

//برای پاسخ دادن به کامنت 
const replyComment=async(commentId)=>{
const body=prompt("متن پاسخ را وارد کنید ")
 if (!body?.trim()) return;
 try{

const response=await fetch(`/api/admin/comment/reply/${commentId}`,{
  method:"POST",
  headers:{"Content-Type": "application/json"},
  body:JSON.stringify({
     body,
   
  })
})


const data=await response.json()
console.log(data);
 if (data.success) {
      toast.success(data.message);

    } else {
      toast.error(data.message);
    }




 }
 
 catch(error){
    toast.error(error.message);
 }


}








 useEffect(() => {
  const getComments = async () => {
    try {
      const response = await fetch(
        `/api/admin/comment?search=${search}&statuscommnet=${statuscommnet}`
      );

      const data = await response.json();
      

      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      toast.error("خطا در دریافت نظرات");
    }
  };

  getComments();
}, [search, statuscommnet]);

  
  
  return (
    <Container fluid className="py-4">
      <div className={styles.header}>
        <h2>مدیریت نظرات کاربران</h2>
        <p>مدیریت، بررسی و پاسخ به نظرات کاربران</p>
      </div>

      <div className={styles.filterBox}>
        <Row className="g-3 align-items-end">
          <Col md={8}>
            <label className={styles.label}>
              جستجو
            </label>

            <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
              type="search"
              placeholder="جستجو بر اساس نام دوره..."
              className={styles.input}
            />
          </Col>

          <Col md={4}>
            <label className={styles.label}>
              وضعیت
            </label>

            <select value={statuscommnet}
            onChange={(e)=>setStatuscommnet(e.target.value)}
            className={styles.select}>
              <option value="">همه کامنت‌ها</option>
              <option value="approved"  >تایید شده</option>
              <option value="pending">در انتظار تایید</option>
             
            </select>
          </Col>
        </Row>
      </div>

      <Row className="g-4">
        {comments.length > 0 ? (
         <Col xs={12}>
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>کاربر</th>
          <th>دوره</th>
          <th>متن نظر</th>
          <th>امتیاز</th>
          <th>وضعیت</th>
          <th>تاریخ</th>
          <th>عملیات</th>
        </tr>
      </thead>

      <tbody>
        {comments.map((comment) => (
          <tr key={comment._id}>
            <td>{comment.user?.name}</td>

            <td>{comment.course?.title}</td>

            <td className={styles.commentBody}>
              {comment.body}
            </td>

            <td>{comment.score}</td>

            <td>
              <span
                className={`${styles.status} ${
                  comment.status === "approved"
                    ? styles.approved
                    : comment.status === "pending"
                    ? styles.pending
                    : styles.rejected
                }`}
              >
                {comment.status === "approved"
                  ? "تایید شده"
                  : comment.status === "pending"
                  ? "در انتظار تایید"
                  : "رد شده"}
              </span>
            </td>

            <td>
              {new Date(
                comment.createdAt
              ).toLocaleDateString("fa-IR")}
            </td>

            <td>
              <div className={styles.actions}>
                <button
                onClick={()=>replyComment(comment._id)}
                  className={styles.replyBtn}
                >
                  پاسخ
                </button>

                <button
                onClick={()=>updateComment(comment._id,"approved")}
                  className={styles.acceptBtn}
                >
                  تایید
                </button>

                <button
                onClick={()=>updateComment(comment._id,"rejected")}
                  className={styles.rejectBtn}
                >
                  رد
                </button>

                <button
                onClick={()=>deleteComment(comment._id)}
                  className={styles.deleteBtn}
                >
                  حذف
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</Col>
        ) : (
          <Col>
            <div className={styles.empty}>
              <h4>
                نظری ثبت نشده است
              </h4>

              <p>
                هنوز هیچ نظری برای
                نمایش وجود ندارد.
              </p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
}