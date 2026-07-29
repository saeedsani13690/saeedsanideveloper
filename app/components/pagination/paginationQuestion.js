import { button } from "framer-motion/client"
import styles from "./paginationQuestion.module.css"
export default function PaginationQuestion({page,totalPages,setPage}){
const pages=[
page-1,
page,
page+1
].filter(number=>number>=1 && number<=totalPages)

console.log(pages)

    return(
        <>
        <div className={styles.PaginationQuestion}>
<button
    className={styles.button}
    disabled={page === 1}
    onClick={() => setPage(prev => prev - 1)}
>
    قبلی
</button>

{pages.map((item)=>(

<button key={item} onClick={()=>setPage(item)}
    className={item===page?`${styles.pageButton} ${styles.active}`:styles.pageButton}
    
    >
{item}
</button>

))}



<button
    className={styles.button}
    disabled={page === totalPages}
    onClick={() => setPage(prev => prev + 1)}
>
    بعدی
</button>



        </div>
        
        </>
    )
}