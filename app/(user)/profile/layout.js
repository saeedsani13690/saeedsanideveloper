
import styles from "./layout.module.css"
import UserSlidbar from "@/app/components/layout/Userslidbar"
export default function userlayout({children}){

return(
    <>
    <div className={styles.userlayout}>
<div className={styles.sidebar}>
<UserSlidbar/>
</div>


<div className={styles.contectContainer}>
{children}
</div>
    </div>

    </>
)



}