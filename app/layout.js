
import { Toaster } from "react-hot-toast";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css"
import { AuthProvider } from "@/context/authcontext/authcontext";
import MyHeader from "./components/layout/Headers";
import "@fontsource/vazirmatn"
import { CartProvider } from "@/context/cartContext/CartContext";
import FooterSaeed from "./components/layout/Footer";
import ChatBot from "./components/ChatBot/ChatBot";

export const metadata = {
  title: "Webnaro",
  description: "سایت شخصی و نمونه‌کارهای سعید ثانی",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
     <body>
  <Toaster position="bottom-center" />

  <CartProvider>
    <AuthProvider>
      <MyHeader />
      <main>{children}</main>
      <FooterSaeed />
      <ChatBot/>
    </AuthProvider>
  </CartProvider>
</body>
    </html>
  );
}
