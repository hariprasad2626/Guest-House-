import React from 'react';
import { Room } from '../types';
import RoomCard from './SearchBar';

interface HomePageProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

const HomePage: React.FC<HomePageProps> = ({ rooms, onSelectRoom }) => {
    
    const handleExplore = () => {
        document.getElementById('room-list')?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div>
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden text-center p-8 md:p-16 mb-12">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbb563?q=80&w=2070&auto=format&fit=crop')"}}
                ></div>
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Find Your Tranquil Retreat</h2>
                    <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
                        Discover our collection of beautifully designed rooms, crafted for comfort and serenity. Your perfect escape awaits.
                    </p>
                    <button
                        onClick={handleExplore}
                        className="mt-8 px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                    >
                        Explore Rooms
                    </button>
                </div>
            </div>

            <section id="room-list" className="py-12">
              <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Our Accommodations</h2>
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rooms.map(room => (
                    <RoomCard key={room.id} room={room} onSelectRoom={onSelectRoom} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500">No rooms available at the moment. Please check back later.</p>
              )}
            </section>
        </div>
    );
};

export default HomePage;
