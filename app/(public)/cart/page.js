"use client";

import { useCart } from "@/context/cartContext/CartContext";
import styles from "./page.module.css";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authcontext/authcontext";
import { useRouter } from "next/navigation";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import Link from "next/link";



export default function Cart() {


  const { cart, removeFromCart ,clearCart} = useCart();
  
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.discountPrice?item.discountPrice:item.price || 0),
    0
  );


  const router=useRouter()




//بابت فرستادن ایدی خریداری شده به زرین پال وخرید موفق است
const checkoutehandel=async()=>{
  try{
const orderRes=await fetch ("/api/orders",{
  method:"POST",
  body:JSON.stringify({
    courseIds:cart.map(course=>course._id),
    headers: {
  "Content-Type": "application/json",
}
  }),
  
})

const orderdata=await orderRes.json()


if(!orderdata.success){
 return toast.error(orderdata.message);
}

toast.success("در حال انتقال به درگاه برداخت")


// حل حالا که مدل رو ساختیم باید کاربر رو به درگاه برداخت بفرستیم 
const paymentRes=await fetch("/api/cart/payment/request",{method:"POST",

      headers: {
  "Content-Type": "application/json",
},
  body:JSON.stringify({orderId:orderdata.orderId}),
 
})

const datapeyment=await paymentRes.json()

console.log(paymentRes.status);
console.log(datapeyment);

if(!datapeyment.success){
  return toast.error("خطا دردرگاه برداخت  ارسال")
}




// اگر اون اتوریزی درست شد اونو هدایت کنیم به صفحه درگاه لبرداخت 
router.push(datapeyment.paymentUrl)


  }
  
  
  catch(error){
 toast.error(error.message || "خطا در پرداخت");
  }

  
}








  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🛒 سبد خرید</h2>

      {cart.length === 0 ? (
        <div className={styles.emptyState}>
 <div className={styles.icon}>
         <PiShoppingCartSimpleBold />
    </div>
       <h2>سبد خرید شما خالی است</h2>
        <p>
        هنوز هیچ دوره‌ای به سبد خرید اضافه نکرده‌اید.
        <br />
         با انتخاب یک دوره، یادگیری را از همین امروز شروع کنید.
    </p>

    <div className={styles.actions}>
        <Link href="/#last-courses" className={styles.primaryBtn}>
            مشاهده دوره‌ها
        </Link>

 <Link href="/" className={styles.secondaryBtn}>
             بازگشت به خانه
         </Link>

 </div>

         </div>
      ) : (
        <div className={styles.row}>
          {/* لیست دوره‌ها */}
          <div className={styles.rightdetailsCourse}>
            {cart.map((item) => (
              <div key={item._id} className={styles.courseItem}>
                <div className={styles.courseInfo}>
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={120}
                    height={70}
                  />

                  <div>
                    <p>{item.title}</p>
                  </div>
                </div>

                <div className={styles.courseActions}>
                  
                  <p>{item.discountPrice?item.discountPrice.toLocaleString():item.price} تومان:</p>
                  

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className={styles.deleteBtn}
                  >
                    🗑 حذف دوره
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* خلاصه خرید */}
          <div className={styles.aboutcourse}>
            <div>
              <p>خلاصه خرید</p>
            </div>

            <div>
              <p>تعداد دوره‌ها</p>
              <p>{cart.length}</p>
            </div>

            <div>
              <p>مجموع قیمت</p>
              <p>{totalPrice.toLocaleString()} تومان</p>
            </div>

            <div>
              <p>پرداخت نهایی</p>
              <p>{totalPrice.toLocaleString()} تومان</p>
            </div>

            <button onClick={checkoutehandel} className={styles.checkoutBtn}>
              تکمیل خرید
            </button>

            <p>پرداخت امن با زرین پال</p>
          </div>
        </div>
      )}
    </div>
  );
}







