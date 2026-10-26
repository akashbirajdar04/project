// PayButton.jsx
import React from "react";
import { toast } from "sonner";

export default function PayButton({ onSuccess, btnText = "Pay Now", className }) {
    const handlePay = async () => {
        try {
            toast.info("Processing payment (Mock)...");

            await new Promise(r => setTimeout(r, 1000));

            const mockResponse = {
                razorpay_order_id: "mock_order_" + Date.now(),
                razorpay_payment_id: "mock_pay_" + Date.now(),
                razorpay_signature: "mock_signature"
            };

            toast.success("Payment successful! (Mock)");
            if (onSuccess) onSuccess(mockResponse);
        } catch (e) {
            console.error(e);
            toast.error("Error initiating payment");
        }
    };

    return <button onClick={handlePay} className={className}>{btnText}</button>;
}