// PayButton.jsx
import React from "react";
import api from "../lib/api"; // Ensure api is imported for requests
import { toast } from "sonner";

function loadRazorpayScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function PayButton({ amount, user, onSuccess, btnText = "Pay Now", className }) {
    const handlePay = async () => {
        try {
            // MOCKING PAYMENT SUCCESS as per request "add the user if he clicks on pay option"
            // Bypassing Razorpay entirely for this instance
            toast.info("Processing payment (Mock)...");

            // Simulate API delay
            await new Promise(r => setTimeout(r, 1000));

            // Mock successful response object
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
