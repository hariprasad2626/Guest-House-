import React from 'react';
import { Room } from '../../types';

interface AdminBookingsProps {
    room: Room;
    onClose: () => void;
    onUpdateBookingStatus: (roomId: number, bookingId: number, status: 'confirmed' | 'declined') => void;
}

const AdminBookings: React.FC<AdminBookingsProps> = ({ room, onClose, onUpdateBookingStatus }) => {
    const pending = room.bookings.filter(b => b.status === 'pending');
    const confirmed = room.bookings.filter(b => b.status === 'confirmed');

    const PaperclipIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">Bookings for "{room.name}"</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-2xl font-bold">&times;</button>
                </div>
                
                <div className="overflow-y-auto pr-2">
                    {/* Pending Requests */}
                    <div>
                        <h4 className="font-bold text-lg mb-3 text-amber-700">Pending Requests ({pending.length})</h4>
                        {pending.length > 0 ? (
                            <ul className="space-y-4">
                            {pending.map(b => (
                                <li key={b.id} className="bg-white border border-slate-200 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                        {/* Column 1: Booker Info */}
                                        <div className="space-y-1">
                                            <p className="font-semibold text-slate-900 break-all">{b.email}</p>
                                            <p className="text-sm text-slate-500">
                                                {new Date(b.checkin).toLocaleDateString()} &rarr; {new Date(b.checkout).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-slate-500 pt-1">
                                                Amount: <span className="font-medium text-slate-800">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                                            </p>
                                        </div>

                                        {/* Column 2: Payment Verification Details */}
                                        <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <PaperclipIcon />
                                                <p className="text-sm text-slate-700 font-medium break-all" title={b.paymentScreenshot}>{b.paymentScreenshot || 'No screenshot'}</p>
                                            </div>
                                            {b.comments && (
                                                <div className="border-t border-slate-200 pt-2">
                                                    <p className="text-sm text-slate-600 italic">"{b.comments}"</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Column 3: Actions */}
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => onUpdateBookingStatus(room.id, b.id, 'confirmed')} className="bg-green-100 text-green-800 text-sm font-semibold py-2 px-3 rounded-lg hover:bg-green-200 border border-green-200 transition-colors">Approve</button>
                                            <button onClick={() => onUpdateBookingStatus(room.id, b.id, 'declined')} className="bg-red-100 text-red-800 text-sm font-semibold py-2 px-3 rounded-lg hover:bg-red-200 border border-red-200 transition-colors">Decline</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            </ul>
                        ) : <p className="text-slate-500 text-sm italic py-4">No pending requests.</p>}
                    </div>

                    {/* Confirmed Bookings */}
                    <div className="mt-8">
                        <h4 className="font-bold text-lg mb-2 text-green-700">Confirmed Bookings ({confirmed.length})</h4>
                        {confirmed.length > 0 ? (
                            <ul className="divide-y divide-slate-200 border-y border-slate-200">
                            {confirmed.map(b => (
                                <li key={b.id} className="py-3">
                                    <p className="font-medium text-slate-800">{b.email}</p>
                                    <p className="text-sm text-slate-500">
                                        {new Date(b.checkin).toLocaleDateString()} &rarr; {new Date(b.checkout).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-slate-500"><strong>Amount Paid:</strong> ₹{b.totalAmount.toLocaleString('en-IN')}</p>
                                </li>
                            ))}
                            </ul>
                        ) : <p className="text-slate-500 text-sm italic py-4">No confirmed bookings.</p>}
                    </div>
                </div>

                 <div className="mt-6 pt-4 border-t border-slate-200 text-right">
                    <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
