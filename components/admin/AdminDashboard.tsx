import React, { useState } from 'react';
import { Room } from '../../types';
import RoomForm from './RoomForm';
import AdminBookings from './AdminBookings';
import AdminAccounting from './AdminAccounting';
import AdminSettings from './AdminSettings';

interface AdminDashboardProps {
  rooms: Room[];
  onLogout: () => void;
  onUpdateBookingStatus: (roomId: number, bookingId: number, status: 'confirmed' | 'declined') => void;
  settings: { upiId: string };
  onUpdateSettings: (settings: { upiId: string }) => void;
  onSaveRoom: (payload: any) => Promise<void>;
  onDeleteRoom: (roomId: number) => Promise<void>;
}

type AdminTab = 'rooms' | 'accounting' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ rooms, onLogout, onUpdateBookingStatus, settings, onUpdateSettings, onSaveRoom, onDeleteRoom }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('rooms');
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

  const handleSaveRoom = async (payload: any) => {
    await onSaveRoom(payload);
    setIsFormOpen(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'accounting':
        return <AdminAccounting rooms={rooms} />;
      case 'settings':
        return <AdminSettings settings={settings} onUpdateSettings={onUpdateSettings} />;
      case 'rooms':
      default:
        return (
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
                            disabled={!room.bookings || room.bookings.length === 0}
                        >
                            Manage ({room.bookings?.length || 0})
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
                        <button onClick={() => onDeleteRoom(room.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        );
    }
  };

  const TabButton: React.FC<{tab: AdminTab; label: string;}> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
        <button
          onClick={onLogout}
          className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4 flex-wrap gap-4">
        <div className="flex gap-2">
            <TabButton tab="rooms" label="Rooms" />
            <TabButton tab="accounting" label="Accounting" />
            <TabButton tab="settings" label="Settings" />
        </div>
        {activeTab === 'rooms' && (
            <button
                onClick={handleAddNew}
                className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
                Add New Room
            </button>
        )}
      </div>

      <div>{renderTabContent()}</div>

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