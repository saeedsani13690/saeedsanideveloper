"use client"
import {
  FaUsers,
  FaUserPlus,
  FaBook,
  FaCheckCircle,
  FaComments,
  FaCommentSlash,
  FaShoppingCart,
  FaDollarSign,
} from "react-icons/fa";


import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  pieData
} from "recharts";

import { FaRegCommentDots } from "react-icons/fa";
import { MdFeedback } from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import { MdOutlineContactSupport } from "react-icons/md"
import { Container, Row, Col } from "react-bootstrap";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBell } from "react-icons/fa";
import { useAuth } from "@/context/authcontext/authcontext";
import { useRef } from "react";
import axios from "axios";
import { div } from "framer-motion/client";
import { color } from "framer-motion";





export default function AdminPage() {
const { user, loading,userRefresh } = useAuth();

// این کنغیر برای اشاره به اینچوت عکس است
const fileInputRef=useRef()


// این استیت برای امار کلی سایت 
const [dashboard, setDashboard] = useState({
  totalUsers: 0,
  monthlyUsers: 0,
  totalCourses: 0,
  publishedCourses: 0,
  totalComments: 0,
  pendingComments: 0,
  totalOrders: 0,
  totalIncome: 0,
});

// این استیت برای نمدار ثبت نامی کاربران 
const[usersChart,setUserChart]=useState([])


// این استیت برای داده های فیدبک کاربران
const [stats, setStats] = useState({
  total: 0,
  average: 0,
  pie: {},
  stars: [],
});

// برای نشنان دادن ابلود عکس
const [uploading, setUploading] = useState(false);

// برای نشان دادن درصد 
const [progress, setProgress] = useState(0);

// برای نمیش در حال بارگزاری عکس 
const [processing, setProcessing] = useState(false);
// برای مدیریت مودال نوتیفیکشین
const [showNotifications, setShowNotifications] = useState(false);

// برای مدیریت تعداد زنک خطر برای ادمین 
const [notifications, setNotifications] = useState({
  comments:0,
    Feedbacks:0,
    UnansweredQuestions:0,
    Contacts:0,
    total:0
});



// این تابع برای اعلان زنگ خطر برای هر موضوغی در سایت برای ادمین است 

const getNotifications =async()=>{
try{
const res=await fetch("/api/admin/dashboard/notification")
const data = await res.json();
if(data.success)  setNotifications(data.notifications)
}
catch(error){
}
}












// این تابع برای مدیریت عکس و نام ادمین است 
const handelImageChange=async(e)=>{
  const file = e.target.files[0];
  if (!file) return;

  const formData=new  FormData();
  formData.append("image",file)

  try{

setUploading(true)
setProgress(0)
setProcessing(false)


const res=await axios.put("/api/auth/getme",formData,
{onUploadProgress:(progressEvent)=>{
const percent=Math.round((progressEvent.loaded*100)/progressEvent.total)
setProgress(percent)

if(percent===100) setProcessing(true)
}}

)
  


if(res.data.success) {
  await userRefresh()
  
  toast.success("عکس بروفایل بروزرسانی شد ")
  setProcessing(false);

}else{
   toast.error(data.message);
}


  }
  catch(error){toast.error("خطا در آپلود عکس");}finally{
    setUploading(false)
    setProgress(0)
      setProcessing(false);
  }

}



// این تابع برای گرفتن نمدار ثبت نامی  کاربران است 
const getUserCharts=async()=>{
try{
const res=await fetch ("/api/admin/dashboard/users-chart")
const data=await res.json()

if(data.success) setUserChart(data.chartData)
}
catch(error){
console.log(error);
    toast.error("خطا در دریافت اطلاعات نمودار");
}

  
}



useEffect(()=>{
getUserCharts();
getStats();
getinformationadmin()
getNotifications()
},[])

// این تابع برای گرفتن امار کلی سایت 
const getinformationadmin=async()=>{
try{
const response=await fetch("/api/admin/dashboard")
const data=await response.json()

if(data.success){
  setDashboard(data.dashboard)
  
}
else{
  toast.error(data.message)
}

}
catch(error){
}
}





// این تابع برای گرفتن فیذ بک کاربران برای درصد رضایت 
async function getStats() {
  try {
    const res = await fetch("/api/admin/dashboard/feedback-chart");
    const data = await res.json();
    setStats(data);
  } catch (error) {
    console.log(error);
  }
}

const pieData = [
  {
    name: "کاربران",
    value: dashboard.totalUsers || 0,
  },
  {
    name: "دوره‌ها",
    value: dashboard.totalCourses || 0,
  },
  {
    name: "کامنت‌ها",
    value: dashboard.totalComments || 0,
  },
];


const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
];





const feedbackPieData = [
  {
    name: "خوشحال",
    value: stats.pie.happy || 0,
  },
  {
    name: "معمولی",
    value: stats.pie.normal || 0,
  },
  {
    name: "ناراضی",
    value: stats.pie.sad || 0,
  },
];

const feedbackColors = [
  "#22c55e",
  "#facc15",
  "#ef4444",
];




  
  return (
    <Container className="mt-4">


<Row className="mb-4">
  <Col>
    <div className={styles.welcomeCard}>
      {processing?<p className={styles.textchangeImage}>...در حال ذخیره سازی در سایت "</p>:""}


      <div className={styles.welcomeLeft}>

  
        <div className={styles.avatar } 
        onClick={()=>fileInputRef.current.click()}
        >


         <img
  src={user?.profileImage || "/images/images.png"}
  alt={user?.name || "Admin"}
/>
{uploading && (
<div className={styles.uploadOverlay}>
<span>
{processing ? "در حال اّبلود":""}
        
        
</span>


</div>

)}

 <div className={styles.editAvatar}>
    📷
  </div>

 <input
    type="file"
    accept="image/*"
    hidden
   ref={fileInputRef} 
   onChange={handelImageChange}
    
  />


        </div>
      

       <div className={styles.adminInfo}>
  👋 خوش آمدید، {loading ? "..." : user?.name}

  <p>مدیر سیستم</p>

  <span>
 آخرین ورود:
    {user?.lastLoginAt
      ? new Date(user.lastLoginAt).toLocaleString("fa-IR")
      : " اولین ورود"}


  </span>
</div>
      </div>

      <div className={styles.welcomeRight}
      onClick={()=>setShowNotifications(!showNotifications)}
      >
        <button className={styles.notificationBtn}>
          <FaBell   className={notifications.total > 0 ? styles.ring : styles.noring}/>
          <span className={styles.badge}> {notifications.total}</span>
        </button>

{showNotifications  && (
<div className={styles.notificationMenu}> 
<h6>اعلان‌ها</h6>



<div className={styles.notificationItem}>
  <div className={styles.right}>
    <FaRegCommentDots className={styles.icon} />
    <span>کامنت در انتظار تایید</span>
  </div>
 <span className={notifications.comments > 0 ? styles.countTrue : styles.countFalse}>
  {notifications.comments}
</span>
</div>





<div className={styles.notificationItem}>
  <div className={styles.right}>
    <MdFeedback className={styles.icon} />
    <span>بازخورد در انتظار تایید</span>
  </div>
 <span className={notifications.Feedbacks > 0 ? styles.countTrue : styles.countFalse}>
  {notifications.Feedbacks}
</span>
</div>




<div className={styles.notificationItem}>
  <div className={styles.right}>
    <BsRobot className={styles.icon} />
    <span>سوال کاربر توسط هوش مصنوعی در انتظار تایید</span>
  </div>
 <span className={notifications.UnansweredQuestions > 0 ? styles.countTrue : styles.countFalse}>
    {notifications.UnansweredQuestions}
  </span>
</div>





<div className={styles.notificationItem}>
  <div className={styles.right}>
    <MdOutlineContactSupport className={styles.icon} />
    <span>پیام تماس با ما در انتظار تایید</span>
  </div>
  <span className={notifications.Contacts > 0 ? styles.countTrue : styles.countFalse}>
    {notifications.Contacts}
  </span>
</div>




</div>


)}


      </div>


    </div>
  </Col>
</Row>


        
      <Row className="g-4">
        <Col md={3}>
          <div className={`${styles.dashboardCard} ${styles.alluser}`}>
            <div className={styles.flex}>
              <FaUsers size={30} />
              <div className={styles.information}>
                <h5>کل کاربران</h5>
                <span>{dashboard.totalUsers}</span>
              </div>
            </div>
          </div>
        </Col>

        <Col md={3}>
          <div className={`${styles.dashboardCard} ${styles.userinmount}`}>
            <div className={styles.flex}>
              <FaUserPlus size={30} />
              <div className={styles.information}>
                <h5>کاربران این ماه</h5>
                <span>{dashboard.monthlyUsers}</span>
              </div>
            </div>
          </div>
        </Col>

        <Col md={3}>
          <div className={`${styles.dashboardCard} ${styles.allcourses}`}>
            <div className={styles.flex}>
              <FaBook size={30} />
              <div className={styles.information}>
                <h5>کل دوره ها</h5>
                <span>{dashboard.totalCourses}</span>
              </div>
            </div>
          </div>
        </Col>

        <Col md={3}>
          <div className={`${styles.dashboardCard} ${styles.publishedcourses}`}>
            <div className={styles.flex}>
              <FaCheckCircle size={30} />
              <div className={styles.information}>
                <h5>دوره های منتشر شده</h5>
                <span>{dashboard.publishedCourses}</span>
              </div>
            </div>
          </div>
        </Col>

        <Col md={3}>
          <div className={`${styles.dashboardCard} ${styles.allcomments}`}>
            <div className={styles.flex}>
              <FaComments size={30} />
              <div className={styles.information}>
                <h5>کل کامنت ها</h5>
                <span>{dashboard.totalComments}</span>
              </div>
            </div>
          </div>
        </Col>

        <Col md={3}>
          <div className={`${styles.dashboardCard} ${styles.pendingcomments}`}>
            <div className={styles.flex}>
              <FaCommentSlash size={30} />
              <div className={styles.information}>
                <h5>کامنت های تایید نشده</h5>
                <span>{dashboard.pendingComments}</span>
              </div>
            </div>
          </div>
        </Col>

        <Col md={3}>
          <div className={`${styles.dashboardCard} ${styles.allorders}`}>
            <div className={styles.flex}>
              <FaShoppingCart size={30} />
              <div className={styles.information}>
                <h5>کل سفارش ها</h5>
                <span>{dashboard.totalOrders}</span>
              </div>
            </div>
          </div>
        </Col>

        <Col md={3}>
          <div className={`${styles.dashboardCard} ${styles.totalincome}`}>
            <div className={styles.flex}>
              <FaDollarSign size={30} />
              <div className={styles.information}>
                <h5>درآمد کل</h5>
                <span>{(dashboard.totalIncome || 0).toLocaleString() } </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>





<Row>


  <Col>
 <div className={styles.chartCard}>
  <h5>رضایت کاربران</h5>
  <ResponsiveContainer width="100%" height={320}>
    <PieChart>
      <Pie
        data={feedbackPieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={({ percent }) =>
          `${(percent * 100).toFixed(0)}%`
        }
      >
        {feedbackPieData.map((entry, index) => (
          <Cell
            key={index}
            fill={feedbackColors[index]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>
  </Col>




  <Col>
<div className={styles.chartCard}>
  <h5>آمار سایت</h5>

 <div style={{ width: "100%", height: 350 }}>
  <ResponsiveContainer>
    <PieChart>

      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {pieData.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index]}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>
</div>
  </Col>




</Row>



<Row>

  <Col>
  <div className={styles.chartCard}>
    <div className={styles.chartHeader}>
        <h5>روند ثبت‌نام کاربران</h5>
        <span>۳ ماه اخیر</span>
    </div>
  <div style={{ width: "100%", height: 350 }}>
    {/* // برای رسچانسیو از این استفاده میکنند */}
  <ResponsiveContainer>

    {/* متغیر اصلی نمدار  */}
    <LineChart
      data={usersChart}
      margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
    >
      {/* این خطوط نمدار رو نمایش میده  */}
      <CartesianGrid
        strokeDasharray="6 6"
        vertical={false}
        stroke="#f5f5f5"
      />
      {/* این محور افقی است  */}
      <XAxis
        dataKey="month"
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#fb2d09", fontSize: 20 }}
      />
{/* محور عمودی رو نمایش میده  */}
      <YAxis
        allowDecimals={false}
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#f3edeb", fontSize: 20 }}
      />
{/* وقتی موس روی هر ماه میرود یک چنجره باز میشود  */}
      <Tooltip
        cursor={{ stroke: "#4b7be3", strokeDasharray: "3 3" }}
        contentStyle={{
          borderRadius: "12px",
          border: "none",
          boxShadow: "0 10px 30px rgba(0,0,0,.12)",
        }}
      />

      <Line
        type="monotone"
        dataKey="users"
        stroke="#ebeff547"
        strokeWidth={6}
        dot={{
          r: 5,
          fill: "#2563eb",
          stroke: "#fff",
          strokeWidth: 2,
        }}
        activeDot={{
          r: 8,
          fill: "#2563eb",
        }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
</div>
  </Col>



  <Col>
  {/* برای نمدار درامد که بعدا بنویسی */}
  </Col>
</Row>

    </Container>
  );
}