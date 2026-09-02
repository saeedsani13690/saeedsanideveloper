"use client";
import styles from "./MenuHumberger.module.css"
import Link from "next/link";
import { FaHome, FaMicrophoneAlt,FaTimes } from "react-icons/fa";
import { MdPhone } from "react-icons/md";


export default function Menuhumberger({menuOpen,setMenuOpen}){
    return(
        <>
        <div className={`${  styles.mobileMenu} ${menuOpen?styles.open:""}  `}>
          
          <FaTimes onClick={()=>setMenuOpen(false)}/>

      <Link
        href="/"
        onClick={() => setMenuOpen(false)}
      >
        <FaHome />
        صفحه اصلی
      </Link>

      <Link
        href="/aboutme"
        onClick={() => setMenuOpen(false)}
      >
        <FaMicrophoneAlt />
        درباره من
      </Link>

      <Link
        href="/contact"
        onClick={() => setMenuOpen(false)}
      >
        <MdPhone />
        تماس با ما
      </Link>

    </div>
        
        
        
        
        </>
    )
}