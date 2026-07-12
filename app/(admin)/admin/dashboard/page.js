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
import { Container, Row, Col } from "react-bootstrap";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";



export default function AdminPage() {

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

useEffect(()=>{
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
getinformationadmin()



},[])




  
  return (
    <Container className="mt-4">
        <h2>داشبورد مدیریت</h2>
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
    </Container>
  );
}