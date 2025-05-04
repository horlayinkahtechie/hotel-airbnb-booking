import Checkout from "./checkout";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Checkout />
      </Suspense>
    </div>
  );
}
