"use client"

import styles from "./page.module.css"
import { useEffect, useState } from "react"
import { Container, Table, Badge, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ContactPage(){
    const[contacts,setContacts]=useState([])
    const [loading,setLoading]=useState(true)
    const [showModal,setShowModal]=useState(false)
    const [selectedContact,setSelectedContact]=useState(null)
   


// این تابع برای گرفتن نظرات و مشکلات کابران است 
const getContacts=async()=>{
try{
setLoading(true)
const response=await fetch("/api/admin/contact")
const data=await response.json()

if(!response.ok) throw new  Error(data.message)
    setContacts(data)
}

catch(error){
     toast.error(error.message);
}finally{
    setLoading(false)
}

}

useEffect(()=>{
getContacts()
},[])


if (loading) {
  return (
    <Container className={styles.loadingContainer}>
      <div className={styles.loadingCard}>
        <Spinner animation="border" variant="primary" />

        <h4>در حال دریافت پیام‌ها...</h4>

        <p>لطفاً چند لحظه صبر کنید.</p>
      </div>
    </Container>
  );
}


// این تابع برای مدیریت بیام خوانده شده یا نشده است 
const openModal=async(contact)=>{
  setSelectedContact(contact)
  setShowModal(true)
  if(contact.status==="read") return 
try{
const response=await fetch(`/api/admin/contact/${contact._id}`,{method:"PATCH"})
const data=await response.json()
if (!response.ok) throw new Error(data.message);

setContacts((prev)=>
prev.map((item)=>item._id===contact._id?{...item,status:"read"}:item))
setSelectedContact((prev)=>({...prev,status:"read"}))
}

catch(error){
toast.error(error)
}


}

// برای باک کردن نظرات کاربران
const deleteContact=async(id)=>{
const result = await Swal.fire({
    title: "حذف پیام",
    text: "آیا از حذف این پیام مطمئن هستید؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "انصراف",
    confirmButtonColor: "#dc3545",
  });

 if (!result.isConfirmed) return;



try{
const response=await fetch(`/api/admin/contact/${id}`,{
  method:"DELETE"
})
const data=await response.json()
 if (!response.ok) throw new Error(data.message);

 setContacts((prev)=>prev.filter((item)=>item._id!==id))
 toast.success("بیام حذف شد ")
}
catch(error){
toast.error(error.message);
}
}





    return(<>
     <Container className="py-4">
      <h3 className="mb-4">مدیریت پیام‌ها</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>نام</th>
            <th>ایمیل</th>
            <th>موضوع</th>
            <th>وضعیت</th>
            <th>تاریخ</th>
            <th>عملیات</th>
          </tr>
        </thead>

        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact._id}>
              <td>{index + 1}</td>

              <td>{contact.name}</td>

              <td>{contact.email}</td>

              <td>{contact.subject}</td>

              <td>
                {contact.status==="read" ? (
                  <Badge bg="success">خوانده شده</Badge>
                ) : (
                  <Badge bg="danger">خوانده نشده</Badge>
                )}
              </td>

              <td>
                {new Date(contact.createdAt).toLocaleDateString("fa-IR")}
              </td>
              <td>
  <button
  onClick={()=>openModal(contact) }
   className="btn btn-primary btn-sm">
    مشاهده
  </button>

 <button
    onClick={() => deleteContact(contact._id)}
    className="btn btn-danger btn-sm "
  >
    حذف
  </button>




</td>
            </tr>
          ))}
        </tbody>
      </Table>

{/* // برای مودال است  */}
{showModal && (

<div  className={styles.overlay} onClick={() => setShowModal(false)}>
<div  className={styles.modal}  onClick={(e) => e.stopPropagation()}>
<button
        className={styles.closeBtn}
        onClick={() => setShowModal(false)}
      >
        ✕
      </button>
      <h3>جزئیات پیام</h3>
      <div className={styles.info}>
 <p>  <strong>نام:</strong> {selectedContact?.name} </p>
      </div>
<div className={styles.info} >
<p><strong>ایمیل:</strong> {selectedContact?.email}   </p>
</div>
  <div className={styles.info}>
<p> <strong>موضوع:</strong> {selectedContact?.subject}  </p>
  </div>

   <div className={styles.messageBox}>{selectedContact?.message}  </div>   
</div>
</div>
)}

{/* finish modal */}






    </Container>


    
    </>)
}