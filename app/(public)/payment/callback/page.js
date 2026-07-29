import { Suspense } from "react";
import PaymentCallback from "./peymentcallback";

export default function Page() {
  return (
    <Suspense fallback={<div>در حال بررسی پرداخت...</div>}>
      <PaymentCallback />
    </Suspense>
  );
}