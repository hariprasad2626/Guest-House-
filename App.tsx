import React, { useState } from 'react';
import { type Room, type Booking, BookingStatus } from './types';
import Header from './components/Header';
import HomePage from './components/Welcome';
import RoomDetail from './components/PropertyDetailsCard';
import Footer from './components/SkeletonLoader';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { initialRooms } from './services/geminiService';

export type View = 'home' | 'roomDetail' | 'adminLogin' | 'adminDashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setCurrentView('roomDetail');
    window.scrollTo(0, 0);
  };

  const navigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLogin = () => {
    setIsAdmin(true);
    navigate('adminDashboard');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    navigate('home');
  };

  const handleBookingRequest = (bookingDetails: Omit<Booking, 'id' | 'status'>) => {
    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.id === bookingDetails.roomId) {
          const newBooking: Booking = {
            ...bookingDetails,
            id: Date.now(),
            status: 'pending',
          };
          // Update the specific room in the list
          const updatedRoom = { ...room, bookings: [...room.bookings, newBooking] };
          // If this is the currently selected room, update that state too
          if (selectedRoom?.id === room.id) {
            setSelectedRoom(updatedRoom);
          }
          return updatedRoom;
        }
        return room;
      })
    );
  };

  const handleUpdateBookingStatus = (roomId: number, bookingId: number, status: 'confirmed' | 'declined') => {
    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.id === roomId) {
          let updatedBookings;
          if (status === 'declined') {
            updatedBookings = room.bookings.filter(b => b.id !== bookingId);
          } else {
            updatedBookings = room.bookings.map(b =>
              b.id === bookingId ? { ...b, status: status as BookingStatus } : b
            );
          }
          const updatedRoom = { ...room, bookings: updatedBookings };
           if (selectedRoom?.id === room.id) {
            setSelectedRoom(updatedRoom);
          }
          return updatedRoom;
        }
        return room;
      })
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'roomDetail':
        return selectedRoom ? <RoomDetail room={selectedRoom} onBack={() => navigate('home')} onBook={handleBookingRequest} /> : <HomePage rooms={rooms} onSelectRoom={handleSelectRoom} />;
      case 'adminLogin':
        return <AdminLogin onLogin={handleLogin} />;
      case 'adminDashboard':
        return isAdmin ? <AdminDashboard rooms={rooms} setRooms={setRooms} onLogout={handleLogout} onUpdateBookingStatus={handleUpdateBookingStatus} /> : <AdminLogin onLogin={handleLogin} />;
      case 'home':
      default:
        return <HomePage rooms={rooms} onSelectRoom={handleSelectRoom} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col">
      <Header onNavigate={navigate} isAdmin={isAdmin} />
      <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;