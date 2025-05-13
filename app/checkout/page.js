import Spinner from "../_components/Spinner";
import Checkout from "./checkout";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Checkout />
      </Suspense>
    </div>
  );
}
