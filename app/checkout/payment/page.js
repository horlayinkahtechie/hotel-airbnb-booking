"use client";

import { useState } from "react";
import PaystackButton from "paystack";

const PaymentPage = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const paymentProps = {
    email,
    amount: Number(amount) * 100, // convert Naira to Kobo
    publicKey,
    text: "Pay Now",
    onSuccess: () => alert("Payment Successful"),
    onClose: () => alert("Payment Closed"),
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <h2>Make a Payment</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      />

      <PaystackButton
        {...paymentProps}
        style={{
          width: "100%",
          padding: 10,
          background: "#00C853",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      />
    </div>
  );
};

export default PaymentPage;
