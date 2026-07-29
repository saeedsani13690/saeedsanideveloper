"use client";

import styles from "./Footer.module.css";
import { usePathname } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import {
  FaTelegram,
  FaGithub,
  FaEnvelope,
  FaPhone
} from "react-icons/fa";
import Image from "next/image";


export default function FooterSaeed() {

  const pathname = usePathname();

  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/profile")
  ) return null;


  const year = new Date().getFullYear();


  return (
    <footer className={styles.footer}>

      <Container>

        <Row className={styles.top}>

          {/* Brand */}
          <Col lg={4} md={6} sm={12}>

            <h3 className={styles.title}>
              سعید ثانی
            </h3>

            <p className={styles.text}>
              آموزش برنامه‌نویسی پروژه‌محور
              برای ورود به بازار کار.
            </p>


            <div className={styles.social}>

              <a href="mailto:test@gmail.com">
                <FaEnvelope />
              </a>


              <a 
                href="https://t.me/elvator1369"
                target="_blank"
              >
                <FaTelegram />
              </a>


              <a
                href="https://github.com/saeedsani1369"
                target="_blank"
              >
                <FaGithub />
              </a>

            </div>


          </Col>



          {/* Links */}
          <Col lg={2} md={6} sm={12}>

            <h5>
              دسترسی سریع
            </h5>


            <ul className={styles.links}>

              <li>
                <Link href="/">
                  خانه
                </Link>
              </li>


              <li>
                <Link href="/#last-courses">
                  دوره‌ها
                </Link>
              </li>


              <li>
                <Link href="/aboutme">
                  درباره ما
                </Link>
              </li>


              <li>
                <Link href="/contact">
                  تماس با ما
                </Link>
              </li>


            </ul>


          </Col>




          {/* Support */}
          <Col lg={3} md={6} sm={12}>

            <h5>
              پشتیبانی
            </h5>


            <p className={styles.info}>
              <FaPhone />
              09157060293
            </p>


            <p className={styles.info}>
              <FaEnvelope />
              support@saeedcode.ir
            </p>


          </Col>




          {/* Trust */}
          <Col lg={3} md={6} sm={12}>


            <h5>
              پرداخت امن
            </h5>


            <div className={styles.trust}>


              <div className={styles.trustBox}>
               <Image
               src="/images/1.png"
               alt="زرین پال"
               width={50}
              height={50}
              style={{ objectFit: "contain" }}
              
               />
              </div>


              <div className={styles.trustBox}>
              <Image
               src="/images/download.png"
                 alt="زرین پال"
    width={50}
    height={50}
    style={{ objectFit: "contain" }}
              
               />
              </div>


            </div>


          </Col>


        </Row>


      </Container>


      <div className={styles.bottom}>

        © {year} تمامی حقوق محفوظ است

      </div>


    </footer>

  );
}