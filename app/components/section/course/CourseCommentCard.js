"use client";

import Image from "next/image";
import styles from "./CourseCommnetCard.module.css"

export default function CourseCommentCard({ comment }) {
  return (
    <div className={styles.commentCard}>
      <div className={styles.header}>
        {comment.user?.profileImage ? (
          <Image
            src={comment.user.profileImage}
            alt={comment.user.name}
            width={55}
            height={55}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.defaultAvatar}>
           
            {comment.user?.name?.charAt(0)} {/* اولین خرف رشته را اگ عکس نبود میگذارد */}
          </div>
        )}

        <div className={styles.userInfo}>
          <h4>{comment.user?.name}</h4>

          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>
                {star <= comment.score ? "⭐" : "☆"}
              </span>
            ))}
          </div>

          <span className={styles.date}>
            {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
          </span>
        </div>
      </div>

      <p className={styles.body}>
        {comment.body}
      </p>

      {comment.replies?.length > 0 && (
        <div className={styles.replyBox}>
          <h5>پاسخ مدرس</h5>

          {comment.replies.map((reply) => (
            <div key={reply._id}>
              <p>{reply.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}