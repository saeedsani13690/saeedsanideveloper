"use client";

import { useState  } from "react";
import styles from "./ChatBot.module.css";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";



export default function ChatBot() {
const [isOpen, setIsOpen] = useState(false);
const [messages, setMessages] = useState([
    {
        id:1,
        role:"assistant",
        text:"سلام 👋"
    },
    {
        id:2,
        role:"assistant",
        text:"چطور می‌توانم کمکتان کنم؟"
    }
]);
const [isTyping, setIsTyping] = useState(false);


const sendMessage = async (text) => {
    if (!text.trim()) return;

    const newMessage = {
        id: Date.now(),
        role: "user",
        text
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);


    try {

        const res = await fetch("/api/chatBot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });


        if (!res.ok) {
            throw new Error("خطا در ارتباط با سرور");
        }


        const data = await res.json();


        const botMessage = {
            id: Date.now() + 1,
            role: "assistant",
            text: data.replyBot || "پاسخی دریافت نشد",
            courses: data.courses || []
        };


        setMessages((prev)=>[
            ...prev,
            botMessage,
            
        ]);


    } catch(error) {


        setMessages((prev)=>[
            ...prev,
            {
                id:Date.now()+2,
                role:"assistant",
                text:"متاسفانه مشکلی پیش آمد، دوباره تلاش کنید."
            }
        ]);


    } finally {

        setIsTyping(false);

    }

};



    return (
<>
  <button
  onClick={()=>setIsOpen(!isOpen)}
  className={styles.chatButton}>
        💬
    </button>
{isOpen && (
    <div className={styles.chatWindow}>

      <ChatHeader setIsOpen={setIsOpen}  />  
   <ChatBody messages={messages}
   isTyping={isTyping}
   />
<ChatFooter sendMessage={sendMessage}    />
    </div>
)}
</>
    );
}