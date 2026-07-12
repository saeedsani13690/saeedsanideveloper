"use client"
import styles from "./Hero.module.css";
import Image from "next/image";
import { FaCode } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className={styles.hero}>

      {/* Blur Backgrounds */}
      <div className={styles.blurOne}></div>
      <div className={styles.blurTwo}></div>

      <div className={styles.container}>

        {/* TEXT SECTION */}
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <span className={styles.badge}>
            <FaCode />
            آموزش برنامه نویسی پروژه محور
          </span>

          <h1>
            برنامه نویسی را از صفر تا <span>استخدام</span> یاد بگیر
          </h1>

          <p>
            آموزش های کاملاً پروژه محور، همراه با پشتیبانی و بروزرسانی دائمی.
          </p>

          <div className={styles.actions}>
            <Link href="#last-courses" >
              <button className={styles.primaryBtn}>
                مشاهده دوره ها
              </button>
            </Link>

            <Link href="/aboutme">
              <button className={styles.secondaryBtn}>
                درباره ما
              </button>
            </Link>
          </div>

        </motion.div>

        {/* IMAGE SECTION */}
        <motion.div
          className={styles.image}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            alt="آموزش برنامه نویسی"
            width={550}
            height={550}
            priority
            sizes="(max-width: 768px) 100vw, 550px"
            src="/images/ec95835e-4fff-4704-a9d5-23a4c9a1ac05.png"
          />
        </motion.div>

      </div>
    </section>
  );
}