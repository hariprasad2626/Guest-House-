import React from 'react';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
  onSelectRoom: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onSelectRoom }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <img className="w-full h-56 object-cover" src={room.images[0]} alt={room.name} />
        <div className="absolute top-0 right-0 bg-teal-500 text-white font-bold px-3 py-1 m-4 rounded-md">
          ₹{room.pricePerNight.toLocaleString('en-IN')}/night
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800">{room.name}</h3>
        <p className="text-slate-500 mt-2 text-sm">
          {room.description.substring(0, 100)}...
        </p>
        <button
          onClick={() => onSelectRoom(room)}
          className="mt-4 w-full bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
