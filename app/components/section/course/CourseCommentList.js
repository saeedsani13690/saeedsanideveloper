
"use client";

import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import styles from "./CourseCommentLIst.module.css"
import { Container,Row,Col } from "react-bootstrap";
import CourseCommentCard from "./CourseCommentCard";

export default function CourseCommentList  ({ course,refresh }) {
const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);



// برای گرفتن کامنتهای هر دوره براساس ایدی اون دوره 
useEffect(()=>{
const getComments=async ()=>{

    try{
     const response=await fetch(`/api/comment?courseId=${course._id}`) 
     const data=await response.json()
if (data.success) {
          setComments(data.comments);
        }else{
            toast.error(data.message)
        }
    }
    catch(error){
console.log(error);
    }finally{
          setLoading(false);
    }
}
getComments();
},[course._id])


  if (loading) {
    return <p>در حال دریافت نظرات...</p>;
  }

   if (comments.length === 0) {
  return (
    <section className={styles.emptyComments}>
      <div className={styles.emptyIcon}>💬</div>

      <h3>هنوز نظری ثبت نشده است</h3>

      <p>
        اولین نفری باشید که تجربه خود را از این دوره با دیگران به اشتراک می‌گذارد.
      </p>
    </section>
  );
}




    return(
        <>
     <section className={styles.sectionShowComment}>
      <h2 className={styles.commentTitle}>نظرات کاربران</h2>
<Container >

<Row>

  <div>
    {comments.map((comment) => (
      <Col xs={12} key={comment._id}>
        <CourseCommentCard comment={comment} />
      </Col>
    ))}
  </div>

</Row>


</Container>



     </section>


        </>
    )
}