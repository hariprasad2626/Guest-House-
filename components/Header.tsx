
import React from 'react';
import { View } from '../App';

interface HeaderProps {
    onNavigate: (view: View) => void;
    isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, isAdmin }) => {
  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 max-w-6xl flex justify-between items-center">
        <button onClick={() => onNavigate('home')} className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight cursor-pointer">
          ISKCON Newtown Guest House
        </button>
        <nav className="flex gap-6 text-slate-600 font-medium items-center">
            <button onClick={() => onNavigate('home')} className="hover:text-teal-600 transition-colors">Rooms</button>
            <button onClick={() => onNavigate('about')} className="hover:text-teal-600 transition-colors hidden md:block">About</button>
            <button 
              onClick={() => onNavigate(isAdmin ? 'adminDashboard' : 'adminLogin')} 
              className="bg-slate-100 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors"
            >
              {isAdmin ? 'Admin Dashboard' : 'Admin'}
            </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
