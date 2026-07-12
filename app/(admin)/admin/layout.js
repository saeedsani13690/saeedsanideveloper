import AdminSidebar from "@/app/components/layout/Adminsidebar"
import styles from "./layout.module.css"
export default function AdminLayout({children}){

return(
    <>
    <div className={styles.adminlayout}>
<div className={styles.sidebar}>
<AdminSidebar/>
</div>


<div className={styles.contectContainer}>
{children}
</div>




    </div>
    
    
    
    </>
)



}