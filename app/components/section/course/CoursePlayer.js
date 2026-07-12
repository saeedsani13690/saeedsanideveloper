import styles from "./CoursePlayer.module.css"
import { FaPlayCircle } from "react-icons/fa";
export default function CoursePlayer({videoUrl,loadingVideo}){

return(



    <>
    <section className={styles.playerContainer}>
{loadingVideo?(<div className={styles.loading}>
          <h3>در حال بارگذاری ویدیو...</h3>
        </div>):videoUrl?( <video
          src={videoUrl}
          controls
          autoPlay
          controlsList="nodownload"
          className={styles.video}
        />):(<div className={styles.emptyPlayer}>

          <FaPlayCircle className={styles.icon} />

          <h2>یک جلسه را انتخاب کنید</h2>

          <p>
            برای شروع یادگیری، یکی از جلسات دوره را انتخاب کنید.
          </p>

        </div>) }



    </section>
    
    
    </>
)



}