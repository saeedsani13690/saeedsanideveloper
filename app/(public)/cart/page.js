// "use client";

// import { useCart } from "@/context/cartContext/CartContext";
// import styles from "./page.module.css";
// import Image from "next/image";
// import toast from "react-hot-toast";
// import { useAuth } from "@/context/authcontext/authcontext";

// export default function Cart() {


//   const { cart, removeFromCart ,clearCart} = useCart();
// const {userRefresh}=useAuth()
//   const totalPrice = cart.reduce(
//     (sum, item) => sum + (item.discountPrice?item.discountPrice:item.price || 0),
//     0
//   );




// //بابت فرستادن ایدی خریداری شده به زرین پال وخرید موفق است
// const checkoutehandel=async()=>{
//   try{
// const response=await fetch ("/api/cart/checkout",{
//   method:"POST",
//   body:JSON.stringify({
//     courseids:cart.map(course=>course._id),
//     headers: {
//   "Content-Type": "application/json",
// }
//   }),
  
// })
// const data=await response.json()
// if(!data.success){
//   return toast.error(data.message)
// }
// if(data.success){
//   clearCart()
//   userRefresh()

//   toast.success("خرید با موفقیت انجام شد ")
// }

//   }
  
  
//   catch(error){
//  toast.error(error.message || "خطا در پرداخت");
//   }

  
// }




//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>🛒 سبد خرید</h2>

//       {cart.length === 0 ? (
//         <p className={styles.empty}>سبد خرید خالی است</p>
//       ) : (
//         <div className={styles.row}>
//           {/* لیست دوره‌ها */}
//           <div className={styles.rightdetailsCourse}>
//             {cart.map((item) => (
//               <div key={item._id} className={styles.courseItem}>
//                 <div className={styles.courseInfo}>
//                   <Image
//                     src={item.thumbnail}
//                     alt={item.title}
//                     width={120}
//                     height={70}
//                   />

//                   <div>
//                     <p>{item.title}</p>
//                   </div>
//                 </div>

//                 <div className={styles.courseActions}>
                  
//                   <p>{item.discountPrice?item.discountPrice.toLocaleString():item.price} تومان:</p>
                  

//                   <button
//                     onClick={() => removeFromCart(item._id)}
//                     className={styles.deleteBtn}
//                   >
//                     🗑 حذف دوره
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* خلاصه خرید */}
//           <div className={styles.aboutcourse}>
//             <div>
//               <p>خلاصه خرید</p>
//             </div>

//             <div>
//               <p>تعداد دوره‌ها</p>
//               <p>{cart.length}</p>
//             </div>

//             <div>
//               <p>مجموع قیمت</p>
//               <p>{totalPrice.toLocaleString()} تومان</p>
//             </div>

//             <div>
//               <p>پرداخت نهایی</p>
//               <p>{totalPrice.toLocaleString()} تومان</p>
//             </div>

//             <button onClick={checkoutehandel} className={styles.checkoutBtn}>
//               تکمیل خرید
//             </button>

//             <p>پرداخت امن با زرین پال</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






"use client";

import { useCart } from "@/context/cartContext/CartContext";
import styles from "./page.module.css";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.discountPrice || item.price || 0),
    0
  );

  const checkoutHandler = async () => {
    try {
      if (cart.length === 0) {
        return toast.error("سبد خرید خالی است.");
      }

      const response = await fetch("/api/cart/payment/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseIds: cart.map((course) => course._id),
        }),
      });
// اینجا در واقع اون کد موقت رو میکیره و میفرسته به درگاه پراخت 
      const data = await response.json();

      if (!response.ok || !data.success) {
        return toast.error(data.message || "خطا در ایجاد درخواست پرداخت");
      }

      // انتقال به زرین پال
      window.location.href = data.paymentURL;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "خطا در اتصال به درگاه پرداخت");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🛒 سبد خرید</h2>

      {cart.length === 0 ? (
        <p className={styles.empty}>سبد خرید خالی است</p>
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
                  <p>
                    {(item.discountPrice || item.price).toLocaleString()} تومان
                  </p>

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

            <button
              onClick={checkoutHandler}
              className={styles.checkoutBtn}
            >
              تکمیل خرید
            </button>

            <p>پرداخت امن با زرین پال</p>
          </div>
        </div>
      )}
    </div>
  );
}






