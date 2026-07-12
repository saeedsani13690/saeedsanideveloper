"use client";

import styles from "./UploadProgres.module.css"
import Loader from "../Loader";

export default function UploadProgress({
  uploading,
  processing,
  progress,
  success,
}) {

  if (success) {
    return (
      <p className={styles.success}>
        ✅ ویدیو با موفقیت آپلود شد
      </p>
    );
  }

  if (processing) {
    return (
      <div className={styles.processing}>
        <p>⏳ در حال ذخیره و پردازش ویدیو...</p>
        <Loader/>
      </div>
    );
  }

  if (!uploading) return null;

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <span>در حال آپلود...</span>

        <span>{progress}%</span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

    </div>
  );
}