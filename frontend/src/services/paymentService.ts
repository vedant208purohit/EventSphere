import api from './api';

export const paymentService = {
    createOrder: async (bookingId: string) => {
        const res = await api.post('/payment/create-order', { bookingId });
        return res.data;
    },

    verifyPayment: async (data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        bookingId: string;
    }) => {
        const res = await api.post('/payment/verify', data);
        return res.data;
    },
};
