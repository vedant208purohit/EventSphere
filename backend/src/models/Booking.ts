import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    eventId: mongoose.Types.ObjectId;
    numberOfTickets: number;
    totalPrice: number;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentId: string;
    bookingDate: Date;
    ticketQRCode: string;
    createdAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        numberOfTickets: {
            type: Number,
            required: [true, 'Number of tickets is required'],
            min: 1,
            max: 10,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        paymentId: {
            type: String,
            default: '',
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        ticketQRCode: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.index({ userId: 1, eventId: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
