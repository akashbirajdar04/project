import Razorpay from 'razorpay';
import crypto from 'crypto';
import { RazorpayOrder } from '../models/order.js';
import { ApiResponse } from '../utills/api-response.js';
import { apiError } from '../utills/api-error.js';

// Lazily initialize Razorpay to ensure environment variables are loaded
const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new apiError(500, "Razorpay credentials missing in environment variables");
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            throw new apiError(400, "Amount is required");
        }

        const options = {
            amount: amount * 100, // Razorpay works in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpay = getRazorpay();
        const order = await razorpay.orders.create(options);

        if (!order) {
            throw new apiError(500, "Order creation failed");
        }

        const dbOrder = new RazorpayOrder({
            userId: req.user._id,
            razorpayOrderId: order.id,
            amount: amount,
            currency: order.currency,
            status: "pending"
        });

        await dbOrder.save();

        return res.status(200).json(new ApiResponse(200, {
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            dbOrderId: dbOrder._id
        }, "Order created successfully"));

    } catch (error) {
        console.error("Create Order Error:", error);
        return res.status(500).json(new ApiResponse(500, null, error.message || "Server Error"));
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const dbOrder = await RazorpayOrder.findOne({ razorpayOrderId: razorpay_order_id });

            if (dbOrder) {
                dbOrder.razorpayPaymentId = razorpay_payment_id;
                dbOrder.status = "completed";
                dbOrder.paidAt = new Date();
                await dbOrder.save();
            }

            return res.status(200).json(new ApiResponse(200, { success: true }, "Payment verified successfully"));
        } else {
            return res.status(400).json(new ApiResponse(400, { success: false }, "Invalid signature"));
        }

    } catch (error) {
        console.error("Verify Payment Error:", error);
        return res.status(500).json(new ApiResponse(500, null, error.message || "Server Error"));
    }
};