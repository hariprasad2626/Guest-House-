
import React, { useState, useEffect, useCallback } from 'react';
import { type Room, type Booking, type AppSettings } from './types';
import Header from './components/Header';
import HomePage from './components/Welcome';
import RoomDetail from './components/PropertyDetailsCard';
import Footer from './components/SkeletonLoader';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AboutPage from './components/AboutPage';
import ErrorMessage from './components/ErrorMessage';
import WhatsAppIcon from './components/icons/WhatsAppIcon';

export type View = 'home' | 'roomDetail' | 'adminLogin' | 'adminDashboard' | 'about';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtONZQoirobVb9DCNoTZLLanmvR1YFnBkcy5xWT-VhH2JwR839O9YGDXFhIcbUfyCtwA/exec';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ upiId: '', homepageImageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(async (action: string, payload?: any) => {
    setLoading(true);
    setError(null);
    try {
      // Always use POST with text/plain to avoid CORS preflight issues with Google Apps Script
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, payload }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      
      const resultText = await response.text();
      const result = JSON.parse(resultText);
      
      if (!result.success) {
        throw new Error(result.error || 'An unknown API error occurred.');
      }
      
      return result.data;

    } catch (err: any) {
      const errorMessage = `Failed to fetch data. This is likely a CORS issue. Please check your internet connection and ensure the Google Apps Script is deployed correctly with 'Anyone' access. Error: ${err.message}`;
      setError(errorMessage);
      console.error("API Call Error:", errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const roomsData = await apiCall('getRooms');
      setRooms(roomsData);

      const settingsData = await apiCall('getSettings');
      setSettings(settingsData);
    } catch (err) {
      // Error is already set by apiCall, no need to set it again here.
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
  
  const handleBookingRequest = async (bookingDetails: any) => {
    try {
      const newBooking: Booking = await apiCall('addBooking', bookingDetails);
      
      const updatedRooms = rooms.map(room => {
        if (room.id === bookingDetails.roomId) {
          return { ...room, bookings: [...room.bookings, newBooking] };
        }
        return room;
      });
      setRooms(updatedRooms);
      
      if (selectedRoom?.id === bookingDetails.roomId) {
          setSelectedRoom(prev => prev ? {...prev, bookings: [...prev.bookings, newBooking]} : null);
      }
    } catch (err) {
      console.error('Failed to add booking:', err);
    }
  };

  const handleUpdateBookingStatus = async (roomId: number, bookingId: number, status: 'confirmed' | 'declined') => {
    try {
      await apiCall('updateBookingStatus', { bookingId, status });
      const updatedRooms = rooms.map(room => {
        if (room.id === roomId) {
          if (status === 'declined') {
            return { ...room, bookings: room.bookings.filter(b => b.id !== bookingId) };
          }
          return {
            ...room,
            bookings: room.bookings.map(b => b.id === bookingId ? { ...b, status } : b),
          };
        }
        return room;
      });
      setRooms(updatedRooms);
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };
  
  const handleSaveRoom = async (payload: any) => {
    try {
      const savedRoom: Room = await apiCall('saveRoom', payload);
      
      if (payload.id) { // Existing room updated
        setRooms(rooms.map(r => r.id === savedRoom.id ? savedRoom : r));
      } else { // New room created
        setRooms([...rooms, savedRoom]);
      }
    } catch (err) {
      console.error('Failed to save room:', err);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (window.confirm('Are you sure you want to permanently delete this room?')) {
      try {
        await apiCall('deleteRoom', { roomId });
        setRooms(rooms.filter(r => r.id !== roomId));
      } catch (err) {
        console.error('Failed to delete room:', err);
      }
    }
  };

  const handleUpdateSettings = async (payload: any) => {
    try {
      const updatedSettings = await apiCall('updateSettings', payload);
      setSettings(updatedSettings);
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const renderContent = () => {
    if (loading && rooms.length === 0) { // Only show full-page spinner on initial load
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      );
    }
    if (error && rooms.length === 0) { // Only show full-page error if no data could be loaded
      return <ErrorMessage message={error} />;
    }

    switch (currentView) {
      case 'roomDetail':
        const currentRoomData = rooms.find(r => r.id === selectedRoom?.id) || selectedRoom;
        return currentRoomData ? <RoomDetail room={currentRoomData} onBack={() => navigate('home')} onBook={handleBookingRequest} upiId={settings.upiId} /> : <HomePage rooms={rooms} onSelectRoom={handleSelectRoom} homepageImageUrl={settings.homepageImageUrl} />;
      case 'adminLogin':
        return <AdminLogin onLogin={handleLogin} />;
      case 'adminDashboard':
        return isAdmin ? <AdminDashboard rooms={rooms} onLogout={handleLogout} onUpdateBookingStatus={handleUpdateBookingStatus} settings={settings} onUpdateSettings={handleUpdateSettings} onSaveRoom={handleSaveRoom} onDeleteRoom={handleDeleteRoom} /> : <AdminLogin onLogin={handleLogin} />;
      case 'about':
        return <AboutPage />;
      case 'home':
      default:
        return <HomePage rooms={rooms} onSelectRoom={handleSelectRoom} homepageImageUrl={settings.homepageImageUrl} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col">
      <Header onNavigate={navigate} isAdmin={isAdmin} />
      <main className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        {renderContent()}
        {loading && <div className="fixed top-4 right-4 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse z-20">Syncing...</div>}
        {error && !loading && <div className="fixed bottom-4 right-4 bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-20">{error.length > 100 ? error.substring(0, 100) + '...' : error}</div>}
      </main>
      
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919735933454"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50"
        aria-label="Contact us on WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>

      <Footer />
    </div>
  );
}

export default App;
