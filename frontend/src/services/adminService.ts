import api from './api';
import { Analytics, User, Booking } from '../types';

export const adminService = {
    getAnalytics: async (): Promise<Analytics> => {
        const res = await api.get('/admin/analytics');
        return res.data;
    },

    getUsers: async (): Promise<User[]> => {
        const res = await api.get('/admin/users');
        return res.data;
    },

    toggleBlockUser: async (userId: string) => {
        const res = await api.put(`/admin/users/${userId}/toggle-block`);
        return res.data;
    },

    getUserBookingHistory: async (userId: string): Promise<Booking[]> => {
        const res = await api.get(`/admin/users/${userId}/bookings`);
        return res.data;
    },
};
