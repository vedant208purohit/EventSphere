import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    paymentProvider: string;
    paymentStatus: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    createdAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        paymentProvider: {
            type: String,
            default: 'razorpay',
        },
        paymentStatus: {
            type: String,
            enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
            default: 'created',
        },
        razorpayOrderId: {
            type: String,
            default: '',
        },
        razorpayPaymentId: {
            type: String,
            default: '',
        },
        razorpaySignature: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPayment>('Payment', paymentSchema);
