import api from './api';
import { Booking } from '../types';

export const bookingService = {
    createBooking: async (data: { eventId: string; numberOfTickets: number }): Promise<Booking> => {
        const res = await api.post('/bookings', data);
        return res.data;
    },

    getUserBookings: async (): Promise<Booking[]> => {
        const res = await api.get('/bookings/user');
        return res.data;
    },

    getAllBookings: async (): Promise<Booking[]> => {
        const res = await api.get('/bookings/admin');
        return res.data;
    },

    cancelBooking: async (id: string): Promise<void> => {
        await api.delete(`/bookings/${id}`);
    },
};
