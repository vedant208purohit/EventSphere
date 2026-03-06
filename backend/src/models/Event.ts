import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    category: string;
    location: string;
    date: Date;
    time: string;
    price: number;
    totalSeats: number;
    availableSeats: number;
    organizer: string;
    image: string;
    isFeatured: boolean;
    createdAt: Date;
}

const eventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, 'Event title is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            required: [true, 'Event description is required'],
            maxlength: 5000,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Music', 'Sports', 'Technology', 'Art', 'Food', 'Business', 'Health', 'Education', 'Other'],
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'Event date is required'],
        },
        time: {
            type: String,
            required: [true, 'Event time is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        totalSeats: {
            type: Number,
            required: [true, 'Total seats is required'],
            min: 1,
        },
        availableSeats: {
            type: Number,
            required: [true, 'Available seats is required'],
            min: 0,
        },
        organizer: {
            type: String,
            required: [true, 'Organizer is required'],
            trim: true,
        },
        image: {
            type: String,
            default: '',
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

eventSchema.index({ title: 'text', description: 'text', location: 'text' });
eventSchema.index({ category: 1, date: 1 });

export default mongoose.model<IEvent>('Event', eventSchema);
