import { Container, Row, Col } from "react-bootstrap";
import { FaEnvelope, FaPhoneAlt, FaClock } from "react-icons/fa";
import styles from "./ContactInfo.module.css";

export default function ContactInfo() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.header}>
          <h2>تماس با ما</h2>

          <p>
            اگر درباره دوره‌ها، خرید، ثبت‌نام یا هر موضوع دیگری سوالی دارید،
            از طریق راه‌های زیر با ما در ارتباط باشید.
          </p>
        </div>

        <Row className="g-4">
          <Col lg={4} md={6}>
            <div className={styles.card}>
              <FaEnvelope className={styles.icon} />

              <h4>ایمیل</h4>

              <a href="mailto:support@saeedcode.ir">
                support@saeedcode.ir
              </a>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className={styles.card}>
              <FaPhoneAlt className={styles.icon} />

              <h4>شماره تماس</h4>

              <a href="tel:09120000000">
                0912 000 0000
              </a>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className={styles.card}>
              <FaClock className={styles.icon} />

              <h4>ساعات پاسخگویی</h4>

              <span>شنبه تا پنجشنبه</span>

              <span>۹ صبح تا ۶ عصر</span>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}