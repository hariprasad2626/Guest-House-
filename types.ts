export interface Amenity {
    name: string;
    icon: string; // This will now hold the raw SVG string
}

// A list of common amenities with pre-defined SVG icons to be used as suggestions.
export const COMMON_AMENITIES: Amenity[] = [
    { name: 'Free Wi-Fi', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.111 16.562a4.5 4.5 0 017.778 0M12 20.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" /><path stroke-linecap="round" stroke-linejoin="round" d="M4.875 12.125a7.5 7.5 0 0114.25 0" /></svg>' },
    { name: 'Swimming Pool', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.125 1.125 0 010 2.25H5.625a1.125 1.125 0 010-2.25z" /></svg>' },
    { name: 'Full Kitchen', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /><path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>' },
    { name: 'Air Conditioning', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' },
    { name: 'Free Parking', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11V5m0 0 3 3m-3-3L9 8m-3 4h12M4.75 21V9.25A2.25 2.25 0 017 7h10a2.25 2.25 0 012.25 2.25V21" /></svg>' },
    { name: 'Flat-screen TV', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>' },
    { name: 'Pets Allowed', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l-4-4m0 0l4-4m-4 4h12" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
    { name: 'Fitness Center', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>' },
];


export type BookingStatus = 'pending' | 'confirmed';

export interface Booking {
    id: number;
    roomId: number;
    name: string;
    phone: string;
    email: string;
    checkin: string; // YYYY-MM-DD
    checkout: string; // YYYY-MM-DD
    status: BookingStatus;
    totalAmount: number;
    paymentScreenshot?: string;
    comments?: string;
}

export interface Room {
    id: number;
    name: string;
    description: string;
    pricePerNight: number;
    images: string[];
    amenities: Amenity[];
    maxGuests: number;
    bookings: Booking[];
}