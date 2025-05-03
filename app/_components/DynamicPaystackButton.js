"use client";

import dynamic from "next/dynamic";

const DynamicPaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  {
    ssr: false,
  }
);

export default DynamicPaystackButton;
