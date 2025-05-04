import { Suspense } from "react";
import PaymentComponent from "./PaymentComponent";

export default function paymentPage() {
  return (
    <div>
      <Suspense>
        <PaymentComponent />
      </Suspense>
    </div>
  );
}
