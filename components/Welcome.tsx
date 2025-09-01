
import React, { useState, useMemo } from 'react';
import { Room } from '../types';
import RoomCard from './SearchBar';

interface HomePageProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  homepageImageUrl: string;
}

const HomePage: React.FC<HomePageProps> = ({ rooms, onSelectRoom, homepageImageUrl }) => {
    // State for the filter inputs
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [guests, setGuests] = useState(1);

    const today = new Date().toISOString().split('T')[0];
    
    const defaultHeroImage = "url('https://images.unsplash.com/photo-1542314831-068cd1dbb563?q=80&w=2070&auto=format&fit=crop')";
    const heroImage = homepageImageUrl ? `url('${homepageImageUrl}')` : defaultHeroImage;


    // useMemo to efficiently filter rooms only when dependencies change
    const filteredRooms = useMemo(() => {
        // If no dates are selected, show all rooms
        if (!checkin || !checkout) {
            return rooms; 
        }

        const startDate = new Date(checkin);
        const endDate = new Date(checkout);

        // Prevent filtering on invalid date ranges
        if (startDate >= endDate) {
            return rooms; 
        }

        return rooms.filter(room => {
            // 1. Check guest capacity
            if (room.maxGuests < guests) {
                return false;
            }

            // 2. Check for booking conflicts against confirmed bookings
            const hasConflict = room.bookings.some(booking => {
                if (booking.status !== 'confirmed') return false;
                
                const bookingStart = new Date(booking.checkin);
                const bookingEnd = new Date(booking.checkout);

                // Check for overlap: (StartA < EndB) and (EndA > StartB)
                return startDate < bookingEnd && endDate > bookingStart;
            });

            return !hasConflict; // A room is available if it has no conflicts
        });
    }, [rooms, checkin, checkout, guests]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // The filtering is reactive via useMemo, this just handles the click event
        document.getElementById('room-list')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            {/* Hero Section with Integrated Search */}
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-12 min-h-[400px] flex flex-col justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{backgroundImage: heroImage}}
                ></div>
                <div className="relative z-10 p-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">ISKCON Newtown Guest House</h2>
                    <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
                        Stay close to the temple. Experience peace and comfort.
                    </p>
                </div>
                {/* Search Bar */}
                <div className="relative z-10 -mb-10 mx-auto w-full max-w-4xl px-4">
                    <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-2xl border flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                            <label htmlFor="checkin-date" className="block text-xs font-semibold text-slate-500">Check-in</label>
                            <input 
                                type="date" 
                                id="checkin-date"
                                value={checkin}
                                onChange={e => setCheckin(e.target.value)}
                                min={today}
                                className="w-full p-2 border-0 focus:ring-2 focus:ring-teal-500 rounded-md text-slate-700" 
                                required
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label htmlFor="checkout-date" className="block text-xs font-semibold text-slate-500">Check-out</label>
                            <input 
                                type="date" 
                                id="checkout-date"
                                value={checkout}
                                onChange={e => setCheckout(e.target.value)}
                                min={checkin || today}
                                className="w-full p-2 border-0 focus:ring-2 focus:ring-teal-500 rounded-md text-slate-700" 
                                required
                            />
                        </div>
                        <div className="w-full md:w-32">
                            <label htmlFor="guests" className="block text-xs font-semibold text-slate-500">Guests</label>
                            <input 
                                type="number" 
                                id="guests"
                                value={guests}
                                onChange={e => setGuests(Number(e.target.value))}
                                min="1" 
                                className="w-full p-2 border-0 focus:ring-2 focus:ring-teal-500 rounded-md text-slate-700" 
                            />
                        </div>
                        <button type="submit" className="w-full md:w-auto bg-teal-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <section id="room-list" className="py-12 pt-20">
              <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
                {(!checkin || !checkout) ? 'Our Accommodations' : 'Available Rooms'}
              </h2>
              {rooms.length > 0 && filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredRooms.map(room => (
                    <RoomCard key={room.id} room={room} onSelectRoom={onSelectRoom} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-500 bg-slate-100 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                        {(!checkin || !checkout) ? 'No Rooms Configured' : 'No Rooms Found'}
                    </h3>
                    <p>
                        {(!checkin || !checkout) 
                            ? 'Please add rooms in the admin dashboard to see them here.'
                            : 'Sorry, no rooms match your search criteria. Please try different dates or a lower number of guests.'
                        }
                    </p>
                </div>
              )}
            </section>
        </div>
    );
};

export default HomePage;
