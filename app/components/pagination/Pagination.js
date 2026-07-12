
import styles from './Pagination.module.css';





export default function Pagination({tolalpage,setPage,page}){
return (
    <div className={styles.paginationContainer}>
      {/* دکمه قبلی */}
      <button 
        className={styles.button} 
        onClick={()=>setPage((page)=>page-1)}
        disabled={page==1}
        >
         
  
        <span   >قبلی</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 15L5 10L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* نمایش محدوده صفحات */}
      <span className={styles.pageInfo}>
        صفحه {page} از {tolalpage}
      </span>

      {/* دکمه بعدی */}
      <button 
        className={styles.button} 
      onClick={()=>setPage((page)=>page+1)}
      disabled={page==tolalpage}
   
        
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 15L15 10L5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span onClick={()=>setPage((page)=>page+1)}>بعدی</span>
      </button>
    </div>
  );
}

  



