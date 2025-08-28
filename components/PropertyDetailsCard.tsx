import React, { useState } from 'react';
import { type Room, type Booking } from '../types';
import AmenityChip from './AmenityChip';
import PaymentModal from './PaymentModal';

interface RoomDetailProps {
  room: Room;
  onBack: () => void;
  onBook: (bookingDetails: Omit<Booking, 'id' | 'status'>) => void;
  upiId: string;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ room, onBack, onBook, upiId }) => {
  const [bookingRequested, setBookingRequested] = useState(false);
  const [error, setError] = useState('');
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Omit<Booking, 'id' | 'status' | 'totalAmount' | 'paymentScreenshot' | 'comments'>>({
    roomId: 0,
    email: '',
    checkin: '',
    checkout: '',
  });
  const [totalAmount, setTotalAmount] = useState(0);

  const handleRequestBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const checkin = formData.get('checkin');
    const checkout = formData.get('checkout');

    if (!email || !checkin || !checkout) {
      setError('Please fill in all fields.');
      return;
    }

    const checkinDate = new Date(checkin as string);
    const checkoutDate = new Date(checkout as string);
    
    if (checkinDate >= checkoutDate) {
        setError('Check-out date must be after check-in date.');
        return;
    }

    const isDateConflict = room.bookings.some(booking => {
        const existingCheckin = new Date(booking.checkin);
        const existingCheckout = new Date(booking.checkout);
        return (checkinDate < existingCheckout && checkoutDate > existingCheckin);
    });

    if (isDateConflict) {
        setError('These dates are not available. Please choose different dates.');
        return;
    }

    const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24));
    if (nights <= 0) {
        setError('Booking must be for at least one night.');
        return;
    }
    
    setTotalAmount(nights * room.pricePerNight);
    setBookingDetails({
        roomId: room.id,
        email: email as string,
        checkin: checkin as string,
        checkout: checkout as string,
    });
    setPaymentModalOpen(true);
  };
  
  const handleConfirmBooking = (paymentInfo: { screenshot?: File; comments: string }) => {
    onBook({
        ...bookingDetails,
        totalAmount,
        paymentScreenshot: paymentInfo.screenshot?.name,
        comments: paymentInfo.comments
    });
    setBookingRequested(true);
    setPaymentModalOpen(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in my-8 relative">
       {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onSubmit={handleConfirmBooking}
          roomName={room.name}
          totalAmount={totalAmount}
          upiId={upiId}
        />
      )}
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/70 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 max-h-[500px]">
        <img src={room.images[0]} alt={room.name} className="col-span-2 row-span-2 h-full w-full object-cover" />
        <img src={room.images[1]} alt={room.name} className="h-full w-full object-cover hidden md:block" />
        <img src={room.images[2]} alt={room.name} className="h-full w-full object-cover hidden md:block" />
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{room.name}</h2>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">{room.description}</p>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Amenities</h3>
            <div className="flex flex-wrap gap-3">
              {room.amenities.map(amenity => (
                <AmenityChip key={amenity.name} name={amenity.name} icon={amenity.icon} />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-28">
            <div className="text-2xl font-bold text-slate-800">
              ₹{room.pricePerNight.toLocaleString('en-IN')} <span className="text-base font-normal text-slate-500">/ night</span>
            </div>
            
            <div className="my-4 border-t border-slate-200 pt-4">
              <h4 className="font-bold text-slate-800 mb-2">Availability</h4>
              {room.bookings.length > 0 ? (
                  <ul className="text-sm space-y-1 text-slate-600 max-h-24 overflow-y-auto">
                      {room.bookings.map(b => (
                          <li key={b.id}>
                              <span className={`font-medium ${b.status === 'confirmed' ? 'text-red-600' : 'text-amber-600'}`}>
                                  Booked ({b.status}):
                              </span> {new Date(b.checkin).toLocaleDateString()} - {new Date(b.checkout).toLocaleDateString()}
                          </li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-sm text-green-600 font-medium">This room is currently available!</p>
              )}
            </div>

            {bookingRequested ? (
              <div className="text-center bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-lg">
                <h4 className="font-bold text-lg">Request Sent!</h4>
                <p className="text-sm">Your booking request is pending admin approval. You will receive an email upon confirmation.</p>
                <button onClick={() => setBookingRequested(false)} className="mt-4 text-sm text-blue-700 font-semibold hover:underline">
                  Make another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestBooking}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="checkin" className="block text-sm font-medium text-slate-600">Check-in</label>
                    <input type="date" id="checkin" name="checkin" min={today} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                  </div>
                  <div>
                    <label htmlFor="checkout" className="block text-sm font-medium text-slate-600">Check-out</label>
                    <input type="date" id="checkout" name="checkout" min={today} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-600">Email Address</label>
                    <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="you@example.com" required />
                  </div>
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                <button type="submit" className="mt-6 w-full bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200">
                  Request to Book
                </button>
                <p className="text-xs text-slate-500 text-center mt-2">Admin will confirm your booking</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;