"use client";

import styles from "./page.module.css";
import { FaXmark, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { MdPending } from "react-icons/md";
import Image from "next/image";

export default function OrderModal({ order, onClose }) {
  const getStatus = () => {
    switch (order.status) {
      case "paid":
        return (
          <span className={styles.paid}>
            <FaCircleCheck />
            پرداخت موفق
          </span>
        );

      case "pending":
        return (
          <span className={styles.pending}>
            <MdPending />
            در انتظار
          </span>
        );

      default:
        return (
          <span className={styles.failed}>
            <FaCircleXmark />
            ناموفق
          </span>
        );
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
        >
          <FaXmark />
        </button>

        <h2 className={styles.modalTitle}>
          جزئیات سفارش
        </h2>

        <div className={styles.infoGrid}>
          <div>
            <span>نام کاربر</span>
            <strong>{order.user?.name || "ثبت نشده"}</strong>
          </div>

          <div>
            <span>شماره موبایل</span>
            <strong>{order.user?.phone}</strong>
          </div>

          <div>
            <span>تعداد دوره</span>
            <strong>{order.items.length}</strong>
          </div>

          <div>
            <span>مبلغ کل</span>
            <strong>
              {order.totalprice.toLocaleString()} تومان
            </strong>
          </div>

          <div>
            <span>وضعیت</span>
            {getStatus()}
          </div>

          <div>
            <span>روش پرداخت</span>
            <strong>{order.paymentMethod}</strong>
          </div>

          <div>
            <span>کد پیگیری</span>
            <strong>{order.refId || "-"}</strong>
          </div>

          <div>
            <span>Authority</span>
            <strong>{order.authority || "-"}</strong>
          </div>

          <div>
            <span>تاریخ ثبت</span>
            <strong>
              {new Date(order.createdAt).toLocaleDateString("fa-IR")}
            </strong>
          </div>

          <div>
            <span>تاریخ پرداخت</span>
            <strong>
              {order.paidAt
                ? new Date(order.paidAt).toLocaleDateString("fa-IR")
                : "-"}
            </strong>
          </div>
        </div>

        <h3 className={styles.courseTitle}>
          دوره‌های خریداری شده
        </h3>

        <div className={styles.courseList}>
          {order.items.map((item) => (
            <div
              key={item._id}
              className={styles.courseCard}
            >
              <div className={styles.imageBox}>
                <Image
                  src={item.course.thumbnail}
                  alt={item.course.title}
                  fill
                />
              </div>

              <div className={styles.courseInfo}>
                <h4>{item.course.title}</h4>

                <p>{item.course.slug}</p>
                <span>
                  {item.price.toLocaleString()} تومان
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          className={styles.closeModal}
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </div>
  );
}