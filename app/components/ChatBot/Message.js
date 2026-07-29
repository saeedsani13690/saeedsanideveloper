import styles from "./ChatBot.module.css";

export default function Message({ role, text,courses  }) {
     console.log(role);

    return (

        <div
            className={`${styles.message} ${
                role === "user"
                    ? styles.userMessage
                    : styles.botMessage
            }`}
        >
<p>{text} </p>


{courses?.length>0 && (  <div className={styles.courseList}>

                        {
                            courses.map((course)=>(

                                <div 
                                key={course._id}
                                className={styles.courseCard}
                                >

                                    <h4>
                                        {course.title}
                                    </h4>


                                    <p>
                                        قیمت:
                                        {" "}
                                        {course.price}
                                        {" "}
                                        تومان
                                    </p>
                                </div>

                            ))
                        }

                    </div>)}
                
           

        </div>

    );

}