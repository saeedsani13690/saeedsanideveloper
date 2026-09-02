"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { useState } from "react";
import { useAuth } from "@/context/authcontext/authcontext";
import { useCart } from "@/context/cartContext/CartContext";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdPhone } from "react-icons/md";
// آیکون‌ها
import { FaHome,  FaMicrophoneAlt, FaShoppingCart, FaSignInAlt, FaUser,FaBars,
FaTimes } from "react-icons/fa";
import Menuhumberger from "./MenuHumberger";

export default function MyHeader() {

const {user,loading,logout,userRefresh}=useAuth()
const {cartcount}=useCart()
const pathname=usePathname()
const[menuOpen,setMenuOpen]=useState(false)



if( pathname.startsWith("/auth") ||
  pathname.startsWith("/admin") ) return null;






  return (
    <header className={styles.header}>




<Menuhumberger menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

  
  







      {/* لوگو */}
      <div className={styles.logoContainer}>
        <div className={styles.icon}>
          <img src="/images/iconsiteman.png" alt="Ghost Developer Logo" />
        </div>
      </div>

      {/* منو */}
      <nav className={styles.navContainer}>
        <ul>
          <li>
            <Link href="/">
              <FaHome /> صفحه اصلی
            </Link>
          </li>
          
          <li>
            <Link href="/aboutme">
              <FaMicrophoneAlt /> درباره من
            </Link>
          </li>



          <li>
            <Link href="/contact">
              <MdPhone />  تماس با ما 
            </Link>
          </li>


         
        </ul>
      </nav>

      {/* اکشن‌ها */}
  <div className={styles.actionsContainer}>

  {user ? (
    <Link href={user.role === "admin" ? "/admin/dashboard" : "/profile"}>
      {user.profileImage ? (
        <Image
          src={user.profileImage}
          alt="Profile"
          width={70}
          height={70}
          className={styles.avatar}
          unoptimized
        />
      ) : user.role === "admin" ? (
        <MdAdminPanelSettings size={32} color="#fbbf24" />
      ) : (
        <FaUser size={30} color="white" />
      )}
    </Link>
  ) : (
    <div className={styles.authLinks}>
      <Link href="/auth">
        <FaSignInAlt /> ورود
      </Link>
    </div>
  )}

  {/* فقط برای کاربران عادی و مهمان */}
  {(!user || user.role !== "admin") && (
    <div className={styles.cart}>
      <Link href="/cart">
        <FaShoppingCart />
        {cartcount > 0 && (
          <span className={styles.cartCount}>
            {cartcount}
          </span>
        )}
      </Link>
    </div>
  )}

</div>

{/* //menuhumberger */}
<button className={styles.menuhumberger}
onClick={()=>setMenuOpen(!menuOpen)}
 aria-label="باز کردن منو"
>

  {menuOpen ?"" : <FaBars />}
</button>


    </header>
  );
}


