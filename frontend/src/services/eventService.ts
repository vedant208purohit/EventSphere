import api from './api';
import { EventFilters, EventsResponse, Event } from '../types';

export const eventService = {
    getEvents: async (filters: EventFilters = {}): Promise<EventsResponse> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== null) {
                params.append(key, String(value));
            }
        });
        const res = await api.get(`/events?${params.toString()}`);
        return res.data;
    },

    getEventById: async (id: string): Promise<Event> => {
        const res = await api.get(`/events/${id}`);
        return res.data;
    },

    createEvent: async (data: Partial<Event>): Promise<Event> => {
        const res = await api.post('/events', data);
        return res.data;
    },

    updateEvent: async (id: string, data: Partial<Event>): Promise<Event> => {
        const res = await api.put(`/events/${id}`, data);
        return res.data;
    },

    deleteEvent: async (id: string): Promise<void> => {
        await api.delete(`/events/${id}`);
    },
};
