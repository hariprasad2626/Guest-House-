import React, { useState, useEffect, useCallback } from 'react';
import { type Room, type Booking, BookingStatus } from './types';
import Header from './components/Header';
import HomePage from './components/Welcome';
import RoomDetail from './components/PropertyDetailsCard';
import Footer from './components/SkeletonLoader';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AboutPage from './components/AboutPage';
import ErrorMessage from './components/ErrorMessage';

export type View = 'home' | 'roomDetail' | 'adminLogin' | 'adminDashboard' | 'about';

interface AppSettings {
  upiId: string;
}

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtONZQoirobVb9DCNoTZLLanmvR1YFnBkcy5xWT-VhH2JwR839O9YGDXFhIcbUfyCtwA/exec';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ upiId: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const roomsRes = await fetch(`${SCRIPT_URL}?action=getRooms`);
      const roomsData = await roomsRes.json();
      if (!roomsData.success) throw new Error(roomsData.error || 'Failed to fetch rooms.');
      setRooms(roomsData.data);

      const settingsRes = await fetch(`${SCRIPT_URL}?action=getSettings`);
      const settingsData = await settingsRes.json();
      if (!settingsData.success) throw new Error(settingsData.error || 'Failed to fetch settings.');
      setSettings(settingsData.data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const apiPost = async (action: string, payload: any) => {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for simple POST requests to Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
      });
      // no-cors means we can't read the response, so we just assume success and refetch
      await fetchData();
    } catch (err: any) {
      setError(`Operation failed: ${err.message}. Please refresh the page.`);
    }
  };

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
  
  const handleBookingRequest = async (bookingDetails: Omit<Booking, 'id' | 'status'>) => {
    setLoading(true);
    await apiPost('addBooking', bookingDetails);
    // Optimistically update the selected room to show the new pending booking
    const updatedRoom = rooms.find(r => r.id === bookingDetails.roomId);
    if(updatedRoom) {
      setSelectedRoom({
        ...updatedRoom,
        bookings: [...updatedRoom.bookings, { ...bookingDetails, id: Date.now(), status: 'pending' }]
      });
    }
    setLoading(false);
  };

  const handleUpdateBookingStatus = async (roomId: number, bookingId: number, status: 'confirmed' | 'declined') => {
    setLoading(true);
    await apiPost('updateBookingStatus', { bookingId, status });
    setLoading(false);
  };
  
  const handleSaveRoom = async (roomData: Room) => {
    setLoading(true);
    await apiPost('saveRoom', roomData);
    setLoading(false);
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (window.confirm('Are you sure you want to permanently delete this room?')) {
        setLoading(true);
        await apiPost('deleteRoom', { roomId });
        setLoading(false);
    }
  };

  const handleUpdateSettings = async (newSettings: AppSettings) => {
    setLoading(true);
    await apiPost('updateSettings', newSettings);
    setLoading(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      );
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }

    switch (currentView) {
      case 'roomDetail':
        const currentRoomData = rooms.find(r => r.id === selectedRoom?.id) || selectedRoom;
        return currentRoomData ? <RoomDetail room={currentRoomData} onBack={() => navigate('home')} onBook={handleBookingRequest} upiId={settings.upiId} /> : <HomePage rooms={rooms} onSelectRoom={handleSelectRoom} />;
      case 'adminLogin':
        return <AdminLogin onLogin={handleLogin} />;
      case 'adminDashboard':
        return isAdmin ? <AdminDashboard rooms={rooms} onLogout={handleLogout} onUpdateBookingStatus={handleUpdateBookingStatus} settings={settings} onUpdateSettings={handleUpdateSettings} onSaveRoom={handleSaveRoom} onDeleteRoom={handleDeleteRoom} /> : <AdminLogin onLogin={handleLogin} />;
      case 'about':
        return <AboutPage />;
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