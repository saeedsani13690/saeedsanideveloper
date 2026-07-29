import styles from "./ChatBot.module.css";

export default function ChatHeader({ setIsOpen }) {

    return (

        <div className={styles.chatHeader}>

            <div className={styles.headerInfo}>

                <div className={styles.botAvatar}>
                    🤖
                </div>

                <div>

                    <h5>دستیار هوشمند</h5>

                    <span>
    <i className={styles.onlineDot}></i>
    آنلاین
</span>

                </div>

            </div>

            <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
            >
                ✕
            </button>

        </div>

    );

}