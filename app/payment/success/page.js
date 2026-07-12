"use client"
import { useCart } from "@/context/cartContext/CartContext";
import { useEffect } from "react";

export default function SuccessPage() {
  const {  clearCart} = useCart();



    useEffect(() => {
    clearCart();
  }, []);
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>✅ پرداخت با موفقیت انجام شد</h1>
      <p>دوره به حساب کاربری شما اضافه شد.</p>
    </div>
  );
}