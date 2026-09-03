import { Toaster } from "react-hot-toast";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "@/context/authcontext/authcontext";
import MyHeader from "./components/layout/Headers";
import "@fontsource/vazirmatn";
import { CartProvider } from "@/context/cartContext/CartContext";
import FooterSaeed from "./components/layout/Footer";
import ChatBot from "./components/ChatBot/ChatBot";

export const metadata = {
  metadataBase: new URL("https://webnaro.ir"),

  title: "وبنارو | آموزش برنامه‌نویسی و طراحی وب",

  description:
    "وبنارو؛ آموزش برنامه‌نویسی، طراحی و توسعه وب با آموزش‌های کاربردی، پروژه‌های واقعی و دوره‌های آموزشی سعید ثانی.",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  applicationName: "وبنارو",

  openGraph: {
    title: "وبنارو | آموزش برنامه‌نویسی و طراحی وب",
    description:
      "وبنارو؛ آموزش برنامه‌نویسی، طراحی و توسعه وب با آموزش‌های کاربردی، پروژه‌های واقعی و دوره‌های آموزشی سعید ثانی.",
    url: "https://webnaro.ir/",
    siteName: "وبنارو",
    locale: "fa_IR",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://webnaro.ir/#website",
      url: "https://webnaro.ir/",
      name: "وبنارو",
      description:
        "وبنارو؛ آموزش برنامه‌نویسی، طراحی و توسعه وب با آموزش‌های کاربردی و پروژه‌های واقعی.",
      inLanguage: "fa-IR",
    },
    {
      "@type": "Person",
      "@id": "https://webnaro.ir/#saeed",
      name: "سعید ثانی",
      url: "https://webnaro.ir/",
      jobTitle: "برنامه‌نویس و طراح سایت",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <Toaster position="bottom-center" />

        <CartProvider>
          <AuthProvider>
            <MyHeader />
            <main>{children}</main>
            <FooterSaeed />
            <ChatBot />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}