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
            // 1) Load Razorpay script
            const loaded = await loadRazorpayScript(
                "https://checkout.razorpay.com/v1/checkout.js"
            );
            if (!loaded) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                return;
            }

            // 2) Create order on backend
            const res = await api.post("/payment/create-order", {
                amount: amount
            });

            const data = res.data;

            if (!data.success) {
                toast.error("Unable to create order. Please try again.");
                return;
            }

            const { orderId, amount: orderAmount, currency, keyId } = data;

            // 3) Open Razorpay checkout
            const options = {
                key: keyId,
                amount: orderAmount,
                currency,
                name: "Hostel/Mess Management",
                description: "Enrollment Fee",
                order_id: orderId,
                prefill: {
                    name: user?.name || "User",
                    email: user?.email || "",
                    contact: user?.contact || "",
                },
                notes: {
                    userId: user?._id,
                },
                theme: {
                    color: "#3399cc",
                },
                handler: async function (response) {
                    // Verify payment on backend
                    try {
                        const verifyRes = await api.post("/payment/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            toast.success("Payment successful!");
                            if (onSuccess) onSuccess(response);
                        } else {
                            toast.error("Payment verification failed.");
                        }
                    } catch (e) {
                        console.error(e);
                        toast.error("Payment verification error.");
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log("Checkout form closed");
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (e) {
            console.error(e);
            toast.error("Error initiating payment");
        }
    };

    return <button onClick={handlePay} className={className}>{btnText}</button>;
}
