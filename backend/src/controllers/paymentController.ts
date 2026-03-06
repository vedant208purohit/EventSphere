import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Payment from '../models/Payment';
import Booking from '../models/Booking';
import { AuthRequest } from '../middlewares/auth';

const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        if (booking.paymentStatus === 'completed') {
            res.status(400).json({ message: 'Payment already completed' });
            return;
        }

        const razorpay = getRazorpayInstance();
        const options = {
            amount: Math.round(booking.totalPrice * 100), // Amount in paise
            currency: 'INR',
            receipt: `receipt_${bookingId}`,
            notes: {
                bookingId: bookingId,
                userId: req.user?._id?.toString() || '',
            },
        };

        const order = await razorpay.orders.create(options);

        // Create payment record
        await Payment.create({
            userId: req.user?._id,
            bookingId,
            amount: booking.totalPrice,
            currency: 'INR',
            razorpayOrderId: order.id,
            paymentStatus: 'created',
        });

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            bookingId,
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Failed to create payment order' });
    }
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
            .update(sign)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            res.status(400).json({ message: 'Payment verification failed' });
            return;
        }

        // Update payment record
        const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
        if (payment) {
            payment.razorpayPaymentId = razorpay_payment_id;
            payment.razorpaySignature = razorpay_signature;
            payment.paymentStatus = 'captured';
            await payment.save();
        }

        // Update booking
        const booking = await Booking.findById(bookingId);
        if (booking) {
            booking.paymentStatus = 'completed';
            booking.paymentId = razorpay_payment_id;
            await booking.save();
        }

        res.json({ message: 'Payment verified successfully', booking });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: 'Payment verification failed' });
    }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const secret = process.env.RAZORPAY_KEY_SECRET as string;
        const signature = req.headers['x-razorpay-signature'] as string;

        const body = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (expectedSignature !== signature) {
            res.status(400).json({ message: 'Invalid webhook signature' });
            return;
        }

        const event = req.body.event;

        if (event === 'payment.captured') {
            const paymentEntity = req.body.payload.payment.entity;
            const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });

            if (payment) {
                payment.razorpayPaymentId = paymentEntity.id;
                payment.paymentStatus = 'captured';
                await payment.save();

                const booking = await Booking.findById(payment.bookingId);
                if (booking) {
                    booking.paymentStatus = 'completed';
                    booking.paymentId = paymentEntity.id;
                    await booking.save();
                }
            }
        }

        if (event === 'payment.failed') {
            const paymentEntity = req.body.payload.payment.entity;
            const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });

            if (payment) {
                payment.paymentStatus = 'failed';
                await payment.save();

                const booking = await Booking.findById(payment.bookingId);
                if (booking) {
                    booking.paymentStatus = 'failed';
                    await booking.save();
                }
            }
        }

        res.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
};
