"use client"
import Link from 'next/link';
import styles from "./Userslidbar.module.css";
import { MdDashboard,  MdLogout } from 'react-icons/md';
import { FaUsers, FaComment } from 'react-icons/fa';
import { BsShop } from 'react-icons/bs';
import { useAuth } from '@/context/authcontext/authcontext';

export default function UserSlidbar() {

const {logout}=useAuth()


  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <BsShop className={styles.logoIcon} />
        <h2 className={styles.title}>saeedsanideveloper</h2>
      </div>

      <ul className={styles.menu}>
        <li>
          <Link href="/profile" className={styles.link}>
            <MdDashboard className={styles.icon} />
            <span>پروفایل من</span>
          </Link>
        </li>

        <li>
          <Link href="/profile/courses" className={styles.link}>
            <FaUsers className={styles.icon} />
            <span>دوره های من</span>
          </Link>
        </li>

        <li>
          <Link href="/profile/licenses" className={styles.link}>
            <FaComment className={styles.icon} />
            <span>لایسنس های من </span>
          </Link>
        </li>

<li>
  <button
    type="button"
    onClick={logout}
    className={styles.logoutButton}
  >
    <MdLogout className={styles.icon} />
    <span>خروج</span>
  </button>
</li>








      </ul>




      {/* بخش خروج */}
      <div className={styles.logoutSection}>
       
      </div>
    </div>
  );
}
