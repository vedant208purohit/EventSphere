export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    profileImage: string;
    isBlocked: boolean;
    createdAt: string;
    token?: string;
}

export interface Event {
    _id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    date: string;
    time: string;
    price: number;
    totalSeats: number;
    availableSeats: number;
    organizer: string;
    image: string;
    isFeatured: boolean;
    createdAt: string;
}

export interface Booking {
    _id: string;
    userId: string | User;
    eventId: string | Event;
    numberOfTickets: number;
    totalPrice: number;
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentId: string;
    bookingDate: string;
    ticketQRCode: string;
    createdAt: string;
}

export interface Payment {
    _id: string;
    userId: string;
    bookingId: string;
    amount: number;
    currency: string;
    paymentProvider: string;
    paymentStatus: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    createdAt: string;
}

export interface EventsResponse {
    events: Event[];
    page: number;
    pages: number;
    total: number;
}

export interface Analytics {
    totalUsers: number;
    totalEvents: number;
    totalBookings: number;
    totalRevenue: number;
    revenueOverTime: { _id: { year: number; month: number }; revenue: number; count: number }[];
    bookingsPerEvent: { eventTitle: string; totalBookings: number; totalTickets: number; totalRevenue: number }[];
    userGrowth: { _id: { year: number; month: number }; count: number }[];
    dailyBookings: { _id: string; count: number; revenue: number }[];
}

export interface EventFilters {
    search?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
}
