import styles from "./ChatBot.module.css";
import Message from "./Message";
import { useEffect, useRef } from "react";
import Loader from "../shered/Loader";
export default function ChatBody({messages,isTyping}) {


// برای مشخص کردن جایگاه اخرین بیام هر پیام یا همون عنصر 
const endRef=useRef(null)

//اینجا براساس اخریم پیام اسکرول خودکار انجام میدهد
useEffect(() => {

    endRef.current?.scrollIntoView({
        behavior: "smooth",
    });

}, [messages]);






    return (

        <div className={styles.chatBody}>

            <div className={styles.welcomeMessage}>
 {messages.map((mess)=>(
<Message  key={mess.id}
role={mess.role}
text={mess.text}
 courses={mess.courses}
/>


 ))}



 {isTyping && (<Loader/>)}


     <div ref={endRef}></div>           

            </div>

        </div>

    );

}