"use client"
import Link from 'next/link';
import styles from './Adminsidebar.module.css';
import { MdDashboard, MdAddCircle, MdLogout } from 'react-icons/md';
import { FaUsers, FaComment, FaBook, FaFolder, FaShoppingBag, FaPercent } from 'react-icons/fa';
import { BsShop } from 'react-icons/bs';
import { useAuth } from '@/context/authcontext/authcontext';

export default function AdminSidebar() {

const {logout}=useAuth()


  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <BsShop className={styles.logoIcon} />
        <h2 className={styles.title}>saeedsanideveloper</h2>
      </div>

      <ul className={styles.menu}>
        <li>
          <Link href="/admin/dashboard" className={styles.link}>
            <MdDashboard className={styles.icon} />
            <span>داشبورد</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/users" className={styles.link}>
            <FaUsers className={styles.icon} />
            <span>کاربران</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/comments" className={styles.link}>
            <FaComment className={styles.icon} />
            <span>کامنت‌ها</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/courses" className={styles.link}>
            <FaBook className={styles.icon} />
            <span>دوره‌ها</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/courses/add" className={styles.link}>
            <MdAddCircle className={styles.icon} />
            <span>اضافه کردن دوره</span>
          </Link>
        </li>

       

        <li>
          <Link href="/admin/orders" className={styles.link}>
            <FaShoppingBag className={styles.icon} />
            <span>سفارش‌ها</span>
          </Link>
        </li>



          <li>
          <Link href="/admin/question" className={styles.link}>
            <FaShoppingBag className={styles.icon} />
            <span>طرح سوالات رایج سایت </span>
          </Link>
        </li>

         <li>
          <Link href="/admin/contact" className={styles.link}>
            <FaShoppingBag className={styles.icon} />
            <span>   نظرات کاربران سایت  </span>
          </Link>
        </li>



         <li>
          <Link href="/admin/feedback" className={styles.link}>
            <FaShoppingBag className={styles.icon} />
            <span>     مدیریت بازخوردها  </span>
          </Link>
        </li>


       


<li>
          <Link href="/" className={styles.link}>
           
            <span>صفحه اصلی</span>
          </Link>
        </li>



      </ul>

      {/* بخش خروج */}
      <div className={styles.logoutSection}>
        <button onClick={logout}   className={styles.logoutButton}>
          <MdLogout className={styles.icon} />
          <span>خروج</span>
        </button>
      </div>
    </div>
  );
}
