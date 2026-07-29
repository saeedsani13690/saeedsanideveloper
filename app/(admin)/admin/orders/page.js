"use client"
import { useEffect,useState } from "react"
import styles from "./page.module.css"
import ModalOrder from "./ModalOrder";



export default function Orders(){

// این استیت برای مدیریت سفارش 
const [orders, setOrders] = useState([]);
// برای صفحه بندی یعنی صفحه اول که شمال 5 ایتم است 
const [page, setPage] = useState(1);
// این تعداد کل سفارشها رو میسازه براساس ان بیج بنده  میکنی
 const [totalPages, setTotalPages] = useState(1);
 const [loading, setLoading] = useState(true);
 // این برای نمایش کودال است 
const [selectedOrder, setSelectedOrder] = useState(null);

useEffect(()=>{
 getOrders();
},[page])

// برای گرفتن سفارشها است 
const getOrders=async()=>{
setLoading(true)
const res=await fetch(`/api/admin/orders/?page=${page}`);
const data=await res.json()

if(data.success){
    setOrders(data.orders)
    setTotalPages(data.totalPages);
}
 setLoading(false);
}

if (loading) {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingBox}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>
          در حال دریافت سفارشات...
        </p>
      </div>
    </div>
  );
}







    return(
        <>
        <div className={styles.container}>
 <h1 className={styles.title}>  مدیریت سفارشات </h1>
<div className={styles.tableWrapper}>
<table className={styles.table}>
<thead>
<tr>
 <th>کاربر</th>

              <th>تلفن</th>
              <th>تعداد دوره</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th>عملیات</th>
</tr>
</thead>



<tbody>
{orders.map((order)=>(

<tr key={order._id}>
 <td>{order.user?.name || "بدون نام"}  </td>
                  
     <td>         {order.user?.phone}  </td>   
 <td> {order.items.length}</td>
                
         <td>{order.totalprice.toLocaleString()} تومان   </td>  
                  
      <td>       
       <span
    className={`${styles.status} ${
      order.status === "paid"
        ? styles.paid
        : order.status === "pending"
        ? styles.pending
        : styles.failed
    }`}
  >

        {order.status === "paid" && "پرداخت موفق"}
    {order.status === "pending" && "در انتظار"}
    {order.status === "failed" && "ناموفق"}
    {order.status === "cancelled" && "لغو شده"}
        </span >
         </td> 
                
<td> {new Date(order.createdAt).toLocaleDateString("fa-IR")}</td>
<td>
<button className={styles.viewBtn} onClick={() =>
                      setSelectedOrder(order)
                    } >
                    مشاهده
                  </button>
                </td>

</tr>
))}

</tbody>
</table>
</div>

        </div>


{/* برای نمایش مودال هر سفارش */}

{selectedOrder && (
    <ModalOrder
    order={selectedOrder}
    onClose ={()=>setSelectedOrder(null)}
    
    />
)}

        </>
    )
}