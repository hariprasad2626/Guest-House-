import { Room, AmenityIconType } from '../types';

export const initialRooms: Room[] = [
    {
        id: 1,
        name: 'The Sunstone Suite',
        description: 'A spacious and bright suite with a king-sized bed, a private balcony overlooking the garden, and a modern en-suite bathroom. Perfect for a relaxing couple\'s retreat.',
        pricePerNight: 12500,
        images: [
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16da34?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop',
        ],
        amenities: [
            { name: 'High-speed Wifi', icon: AmenityIconType.WIFI },
            { name: 'Air Conditioning', icon: AmenityIconType.AC },
            { name: '4K TV', icon: AmenityIconType.TV },
            { name: 'Kitchenette', icon: AmenityIconType.KITCHEN },
        ],
        maxGuests: 2,
        bookings: [],
    },
    {
        id: 2,
        name: 'The Emerald Loft',
        description: 'A stylish two-level loft with panoramic city views. Features a fully equipped kitchen, a cozy living area, and a comfortable queen bed on the mezzanine floor.',
        pricePerNight: 17500,
        images: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1590490359854-dfba59590394?q=80&w=800&auto=format&fit=crop',
        ],
        amenities: [
            { name: 'High-speed Wifi', icon: AmenityIconType.WIFI },
            { name: 'Full Kitchen', icon: AmenityIconType.KITCHEN },
            { name: 'Free Parking', icon: AmenityIconType.PARKING },
            { name: 'Access to Gym', icon: AmenityIconType.GYM },
            { name: 'Smart TV', icon: AmenityIconType.TV },
        ],
        maxGuests: 3,
        bookings: [],
    },
    {
        id: 3,
        name: 'The Garden Bungalow',
        description: 'A charming and private bungalow nestled within our lush gardens. Enjoy your own patio, a serene atmosphere, and easy access to the shared swimming pool.',
        pricePerNight: 14000,
        images: [
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
        ],
        amenities: [
            { name: 'Swimming Pool', icon: AmenityIconType.POOL },
            { name: 'High-speed Wifi', icon: AmenityIconType.WIFI },
            { name: 'Pets Allowed', icon: AmenityIconType.PETS },
            { name: 'Air Conditioning', icon: AmenityIconType.AC },
        ],
        maxGuests: 4,
        bookings: [],
    }
];
