"use client"

import styles from "./page.module.css"
import { FaUserCircle, FaPhoneAlt, FaCalendarAlt, FaEdit } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { FaBookOpen, FaClock, FaChartLine } from "react-icons/fa";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Container, Row, Col, Modal, Button,Form } from "react-bootstrap";
import { useAuth } from "@/context/authcontext/authcontext";
export default function ProfilePAge(){
    const [mycourse,setMycourse]=useState([])
    const [user, setUser] = useState(null);
    const [showModal,setShowModal]=useState(false);
    const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [image, setImage] = useState(null);
const [preview, setPreview] = useState("");
const { setUser: setAuthUser } = useAuth();


console.log(user)



    


//برای گرفن اطلاعات اون کاربر برای نمایش عکس و عیزه 
useEffect(()=>{
const getprofile=async()=>{
const response=await fetch("/api/auth/getme")
const data=await response.json()
 if (data.success) {
            setUser(data.user);
            setMycourse(data.user.purchesedCourses);
             setName(data.user.name || "");
    setEmail(data.user.email || "");
    setPreview(data.user.profileImage || "");
        }
}
getprofile();

},[])


//برای مدت زمان کل دوره های که خریده جمع میکینم و داخل متغیر میریزیم
const totalMinutes=mycourse.reduce((total,course)=>{
const duration=course.totalDuration
  const match = duration.match(/(\d+)\s*ساعت\s*و\s*(\d+)\s*دقیقه/);
if (!match) return total;
const hours = Number(match[1]);
    const minutes = Number(match[2]);
return total + hours * 60 + minutes;
},0)
const totalHours = Math.floor(totalMinutes / 60);
const remainingMinutes = totalMinutes % 60;

// برای ذخیره سازی عکس
const imageHandler=(e)=>{
const file=e.target.files[0]
if(!file) return;
setImage(file)
setPreview(URL.createObjectURL(file));
}


//برای فرستادن اطلاعات کاربر برای تکیمل پروفایل

const compeleteProfile=async()=>{
const formData=new FormData()
formData.append("name",name)
  formData.append("email", email);
 if (image) {
        formData.append("image", image);
    }


if(!image){
     return toast.error("عکس برای پروفایل الزامی است ")
}

const response=await fetch("/api/auth/getme",{
    method:"PUT",
    body:formData
})

const data=await response.json()
if(data.success){
    toast.success(data.message)
    setUser(data.user);
    setPreview(data.user.profileImage);
    setAuthUser(data.user)
    setShowModal(false);
   
}else{
     toast.error(data.message);
}


}







return(
    <>
   <Modal
    show={showModal}
    onHide={() => setShowModal(false)}
    centered
>
    <Modal.Header closeButton>
        <Modal.Title>ویرایش پروفایل</Modal.Title>
    </Modal.Header>

    <Modal.Body>
<Form>

    <Form.Group className="mb-3">

        <Form.Label>نام</Form.Label>

        <Form.Control
            value={name}
            onChange={(e)=>setName(e.target.value)}
        />

    </Form.Group>

    <Form.Group>

        <Form.Label>ایمیل</Form.Label>

        <Form.Control
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
        />

    </Form.Group>

</Form>
        

    </Modal.Body>

    <Modal.Footer>
        <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
        >
            انصراف
        </Button>

        <Button  type="button" onClick={compeleteProfile} variant="primary">
            ذخیره
        </Button>
    </Modal.Footer>
</Modal>


<Container> 
<Row className={styles.headerprofile}>
<Col>
  <input
    type="file"
    id="profileImage"
    accept="image/*"
    hidden
     onChange={imageHandler}
       
  />

  <label htmlFor="profileImage" className={styles.imgprofile}>
        {preview?<Image src={preview}  width={180}
                height={180}
                alt="Profile"
                className={styles.profileImage}
                unoptimized
                  style={{
            borderRadius: "50%",
            objectFit: "cover"
        }}   />
        :<div><FaCamera size={40} /> </div>}
  </label>
</Col>






<Col className={styles.profileInfo}>
    <h2>
        <FaUserCircle className={styles.iconTitle} />
         کاربر عزیز {user?.name|| "پروفایل خود را تکمیل کنید "} 
    </h2>

    <p>
        <FaPhoneAlt className={styles.icon} />
        {user?.phone}
    </p>

    <p>
        <FaCalendarAlt className={styles.icon} />
       تاریخ عضویت:
    {user?.createdAt &&
        new Date(user.createdAt).toLocaleDateString("fa-IR")}
    </p>

    <button onClick={() => setShowModal(true)}  className={styles.editBtn}>
        <FaEdit />
        ویرایش پروفایل
    </button>
</Col>
</Row>


<Row className={styles.statsRow}>
    <Col md={4}>
        <div className={styles.statCard}>
            <div className={styles.iconBox}>
                <FaBookOpen />
            </div>

            <div className={styles.statContent}>
                <h5>دوره‌های خریداری شده</h5>
               <span>{mycourse.length}</span>
            </div>
        </div>
    </Col>

    <Col md={4}>
        <div className={styles.statCard}>
            <div className={styles.iconBox}>
                <FaClock />
            </div>

            <div className={styles.statContent}>
                <h5>ساعت یادگیری</h5>
                <span>{totalHours} ساعت و {remainingMinutes} دقیقه</span>
            </div>
        </div>
    </Col>

    <Col md={4}>
        <div className={styles.statCard}>
            <div className={styles.iconBox}>
                <FaChartLine />
            </div>

            <div className={styles.statContent}>
                <h5>وضعیت فعلی</h5>
                <span>در حال یادگیری</span>
            </div>
        </div>
    </Col>
</Row>


<Row className={styles.showbuycourse}>
    {mycourse.length === 0 ? (
        <p className={styles.emptyCourse}>
            هنوز هیچ دوره‌ای خریداری نکرده‌اید.
        </p>
    ) : (
        mycourse.map((course) => (
            <Col md={4} key={course._id}>
                <div className={styles.courseCard}>
                    <Image
                        src={course.thumbnail}
                        width={300}
                        height={180}
                        alt={course.title}
                        unoptimized={course.thumbnail?.includes("arvanstorage.ir")}
                    />

                    <h5>{course.title}</h5>

                    <p>📚 تعداد درس: {course.lessonsCount}</p>

                    <p>⏰ زمان دوره: {course.totalDuration}</p>
                </div>
            </Col>
        ))
    )}
</Row>

</Container>


    </>
)

}