export enum AmenityIconType {
    WIFI = 'wifi',
    POOL = 'pool',
    KITCHEN = 'kitchen',
    AC = 'ac',
    PARKING = 'parking',
    TV = 'tv',
    PETS = 'pets',
    GYM = 'gym',
}

export interface Amenity {
    name: string;
    icon: AmenityIconType;
}

export const ALL_AMENITIES: Amenity[] = [
    { name: 'Free Wi-Fi', icon: AmenityIconType.WIFI },
    { name: 'Swimming Pool', icon: AmenityIconType.POOL },
    { name: 'Full Kitchen', icon: AmenityIconType.KITCHEN },
    { name: 'Air Conditioning', icon: AmenityIconType.AC },
    { name: 'Free Parking', icon: AmenityIconType.PARKING },
    { name: 'Flat-screen TV', icon: AmenityIconType.TV },
    { name: 'Pets Allowed', icon: AmenityIconType.PETS },
    { name: 'Fitness Center', icon: AmenityIconType.GYM },
];


export type BookingStatus = 'pending' | 'confirmed';

export interface Booking {
    id: number;
    roomId: number;
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