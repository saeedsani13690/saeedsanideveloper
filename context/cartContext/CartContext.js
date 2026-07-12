"use client";

import { createContext, useContext, useEffect, useState } from "react";


const CartContext = createContext();
// 👉 CartProvider یعنی:
// “هر چیزی داخل این باشه، به cart دسترسی داره”
export function CartProvider({children }){
const [cart, setCart] = useState([]);


//این بابت دفعه دوم اکر رندر شد بیاد اون محصول رو بگیره از لوکال
useEffect(() => {
  try {
    const saveCart = localStorage.getItem("cart");

    if (saveCart) {
      setCart(JSON.parse(saveCart));
    }
  } catch (error) {
    localStorage.removeItem("cart");
  }
}, []);



//برای اولین بار که محصول افاضه میشود باید در لوکال هم ذخیر هشود 
useEffect(()=>{
localStorage.setItem("cart",JSON.stringify(cart))
},[cart])




//افزودن محصول
const addToCart=(product)=>{
setCart((prev)=>{
const exiting=prev.find((item)=>item._id===product._id)

if(exiting){
return prev.map((item)=>item._id===product._id? {...item,quantity:item.quantity + 1}: item  )
}

 return [...prev, { ...product, quantity: 1 }];
})
}
//حذف کامل محصول
 const removeFromCart=(id)=>{
    setCart((prev)=>prev.filter((item)=>item._id!==id))
 }
//کم کردن تعداد محصول 
 const decreaseQty=(id)=>{
setCart((prev)=>prev.map((item)=>item._id===id?{...item,quantity:item.quantity-1}:item)

.filter((item)=>item.quantity>0)
)
 }

 //خالی کردن سبد خرید 

 const clearCart=()=>{
 setCart([]);
  localStorage.removeItem("cart");
 }


 const cartcount=cart.length

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decreaseQty,
        clearCart,
        cartcount
      }}
    >
      {children}
    </CartContext.Provider>
  );


}

export const useCart = () => useContext(CartContext);

 