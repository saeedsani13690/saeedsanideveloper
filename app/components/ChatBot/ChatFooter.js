import { useState } from "react";
import styles from "./ChatBot.module.css";
import { IoSend } from "react-icons/io5";

export default function ChatFooter({ sendMessage }) {
    const [text, setText] = useState("");


    function handleSend(){
        sendMessage(text)
        setText("")
    }


    return (

        <div className={styles.chatFooter}>
 <input
                type="text"
                placeholder="پیام خود را بنویسید..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {

                    if (e.key === "Enter") {

                        handleSend();

                    }

                }}
            />
<button onClick={handleSend}>

                <IoSend />

            </button>



        </div>

    );

}