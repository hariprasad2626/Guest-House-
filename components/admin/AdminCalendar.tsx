
import React, { useState, useMemo } from 'react';
import { Room, Booking } from '../../types';

interface AdminCalendarProps {
  rooms: Room[];
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ rooms }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(rooms.length > 0 ? rooms[0].id : null);

  const selectedRoom = useMemo(() => {
    return rooms.find(r => r.id === selectedRoomId);
  }, [rooms, selectedRoomId]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay(); // 0 = Sunday, 1 = Monday...

  const bookingsForMonth = useMemo(() => {
    if (!selectedRoom) return [];
    
    return selectedRoom.bookings.filter(booking => {
      const checkin = new Date(booking.checkin);
      const checkout = new Date(booking.checkout);
      const calendarStart = new Date(year, currentDate.getMonth(), 1);
      const calendarEnd = new Date(year, currentDate.getMonth() + 1, 0);

      // Check for overlap
      return checkin < calendarEnd && checkout > calendarStart;
    });
  }, [selectedRoom, currentDate, year]);

  const renderCalendar = () => {
    const days = [];
    // Pad start of month with empty cells
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-start-${i}`} className="border border-slate-200 bg-slate-50"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, currentDate.getMonth(), day);
      const bookingsForDay = bookingsForMonth.filter(booking => {
        const checkin = new Date(booking.checkin);
        const checkout = new Date(booking.checkout);
        // Reset time part to compare dates only
        checkin.setHours(0,0,0,0);
        checkout.setHours(0,0,0,0);
        date.setHours(0,0,0,0);
        return date >= checkin && date < checkout;
      });

      days.push(
        <div key={day} className="border border-slate-200 p-2 min-h-[100px] flex flex-col">
          <span className="font-semibold text-slate-700">{day}</span>
          <div className="flex-grow space-y-1 mt-1">
            {bookingsForDay.map(booking => (
              <div key={booking.id} className={`p-1 rounded text-xs truncate ${
                booking.status === 'confirmed' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {booking.name}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button onClick={goToPreviousMonth} className="px-3 py-1 bg-slate-200 rounded-md hover:bg-slate-300">&larr;</button>
          <h3 className="text-xl font-bold text-slate-800 w-48 text-center">{monthName} {year}</h3>
          <button onClick={goToNextMonth} className="px-3 py-1 bg-slate-200 rounded-md hover:bg-slate-300">&rarr;</button>
        </div>
        <div>
          <label htmlFor="room-select" className="sr-only">Select a Room</label>
          <select 
            id="room-select"
            value={selectedRoomId ?? ''}
            onChange={(e) => setSelectedRoomId(Number(e.target.value))}
            className="p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-0 text-center font-semibold text-sm text-slate-600 mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="grid grid-cols-7 gap-0 bg-white">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default AdminCalendar;
