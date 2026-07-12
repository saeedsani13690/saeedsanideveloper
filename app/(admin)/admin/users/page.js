"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import styles from "./AdminUser.module.css"
import Pagination from "@/app/components/pagination/Pagination"

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const[ismodalOpen,setIsmodalOPen]=useState(false)
  const[page,setPage]=useState(1)
  const[totalusers,setTotalusers]=useState(0)
const tolalpage=Math.ceil(totalusers/5)



  


  
 


const [formModal,setFormModal]=useState({
  id:"",
    name:"",
    email:"",
    phone:""
})


const edithandlerusers= async(id)=>{
try{
const response=await fetch(`/api/admin/users/${id}`,{
method:"PATCH",
headers:{"content-Type":"application/json"},
body:JSON.stringify(formModal)
})
const data=await response.json()
if(data.success){
  toast.success("تغییرات کاربر با موفقیت انجام شد")
  setIsmodalOPen(false)
}else{
  toast.error("خطا در ذخیره تغییرات ")
}

}
catch(error){
toast.error("خطای سرور")
}
}






const editmodal=(user)=>{
setIsmodalOPen(true)
setFormModal({
  id:user._id || user.id,
  name:user.name,
  email:user.email || "",
phone:user.phone,
role:user.role
})
}







  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/users?search=${search}&page=${page}`)
        
        
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        
        
        

        // اگر API آرایه برگرداند:
        setUsers(data.users || data || [])
        setTotalusers(data.totalusers)
        
         
      } catch (error) {
        console.error(error)
        toast.error("کاربران پیدا نشدند")
      } finally {
        setLoading(false)
      }
    }

    getUsers()
  }, [search,page])






  const filteredUsers = users.filter((user) => {
    const id=user.id || user._id
    const name = user.name || user.fullName || ""
    const email = user.email || ""
    const phone = user.phone || user.mobile || ""

    return (
      id.toLowerCase().includes(search.toLocaleLowerCase())||
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      phone.toLowerCase().includes(search.toLowerCase())
    )
  })








  return (
    <div  className={styles.container}>
      <div className={styles.headers}>
        <h1>مدیریت کاربران</h1>
      </div>

      <div className={styles.searchbox}>
        <input
          type="text"
          placeholder="جستجو بر اساس نام، ایمیل یا شماره موبایل"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>در حال دریافت کاربران...</p>
      ) : filteredUsers.length === 0 ? (
        <p>کاربری پیدا نشد</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>نام</th>
              <th>شماره موبایل</th>
              <th>ایمیل</th>
              <th>نقش</th>
              <th>تایید شده</th>
              <th>تاریخ ثبت نام</th>
              <th>عملیات</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id || user.id}>
                
                <td>{user.name ||  "—"}</td>
                <td>{user.phone ||  "—"}</td>
                <td>{user.email || "—"}</td>
                <td>{user.role || "user"}</td>
                <td>{user.isverified ? "بله" : "خیر"}</td>
                <td>
                   
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("fa-IR")
                    : "—"}
                </td>
                <td>
                  <button onClick={()=>editmodal(user)} className={styles.editBtn}>ویرایش</button>
                  <button className={styles.deleteBtn}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}






{ismodalOpen ? (
  <div className={styles.modals}>
    <button
      type="button"
      className={styles.closeBtn}
      onClick={() => setIsmodalOPen(false)}
    >
      ×
    </button>
    <h1>ویرایش اطلاعات کاربر</h1>

    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">نام</label>
        <input onChange={(e)=>setFormModal({...formModal,name:e.target.value})} value={formModal.name} type="text" id="name" />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">ایمیل</label>
        <input  onChange={(e)=>setFormModal({...formModal,email:e.target.value})} value={formModal.email} type="email" id="email" />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phone">شماره تماس</label>
        <input value={formModal.phone} type="tel" disabled id="phone" />
      </div>
<div className={styles.formGroup}>
        <label htmlFor="role"> نقش کاربر</label>
    
        <select  onChange={(e)=>setFormModal({...formModal,role:e.target.value})} value={formModal.role} name="" id="">
<option value="user">کاربر عادی</option>
        <option value="admin">ادمین</option>

        </select>
        
      </div>
      <button onClick={()=>edithandlerusers(formModal.id)}   className={styles.submitBtn}>
        ثبت تغییرات
      </button>
    </form>
  </div>
) : null}




<Pagination tolalpage={tolalpage} setPage={setPage} page={page}  />










    </div>
  )
}
