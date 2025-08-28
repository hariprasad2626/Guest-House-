import React, { useState } from 'react';
import { Room } from '../../types';
import RoomForm from './RoomForm';
import AdminBookings from './AdminBookings';

interface AdminDashboardProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  onLogout: () => void;
  onUpdateBookingStatus: (roomId: number, bookingId: number, status: 'confirmed' | 'declined') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ rooms, setRooms, onLogout, onUpdateBookingStatus }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [bookingModalRoom, setBookingModalRoom] = useState<Room | null>(null);

  const handleAddNew = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = (roomId: number) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(room => room.id !== roomId));
    }
  };

  const handleSaveRoom = (roomData: Room) => {
    if (editingRoom) {
      // Update existing room
      setRooms(rooms.map(r => (r.id === roomData.id ? roomData : r)));
    } else {
      // Add new room
      const newRoom = { ...roomData, id: Date.now(), bookings: [] }; // New rooms have no bookings
      setRooms([...rooms, newRoom]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Manage Rooms</h2>
        <div>
          <button
            onClick={handleAddNew}
            className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200 mr-4"
          >
            Add New Room
          </button>
          <button
            onClick={onLogout}
            className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price/Night</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bookings</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {rooms.map(room => {
              const pendingBookings = room.bookings.filter(b => b.status === 'pending').length;
              return (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{room.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">₹{room.pricePerNight.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                     <button 
                        onClick={() => setBookingModalRoom(room)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900 relative disabled:text-slate-400 disabled:cursor-not-allowed"
                        disabled={room.bookings.length === 0}
                    >
                        Manage ({room.bookings.length})
                        {pendingBookings > 0 && (
                            <span className="absolute -top-2 -right-3 flex h-5 w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">{pendingBookings}</span>
                            </span>
                        )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(room)} className="text-teal-600 hover:text-teal-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <RoomForm
          room={editingRoom}
          onSave={handleSaveRoom}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      {bookingModalRoom && (
        <AdminBookings
            room={bookingModalRoom}
            onClose={() => setBookingModalRoom(null)}
            onUpdateBookingStatus={onUpdateBookingStatus}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
