import Checkout from "./checkout";
import { Suspense } from "react";

const PaymentPage = dynamic(() => import("./payment"), { ssr: false });

export default function CheckoutPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Checkout />
      </Suspense>
    </div>
  );
}
