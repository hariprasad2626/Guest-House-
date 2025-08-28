import React from 'react';
import { Room } from '../../types';

interface AdminAccountingProps {
  rooms: Room[];
}

const AdminAccounting: React.FC<AdminAccountingProps> = ({ rooms }) => {
  const allBookings = rooms.flatMap(room =>
    room.bookings.map(booking => ({ ...booking, roomName: room.name }))
  );
  
  const confirmedBookings = allBookings.filter(b => b.status === 'confirmed');
  const pendingBookings = allBookings.filter(b => b.status === 'pending');

  const totalConfirmedRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const potentialPendingRevenue = pendingBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Financial Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-700">Total Confirmed Revenue</p>
            <p className="text-3xl font-bold text-green-800 mt-1">₹{totalConfirmedRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <p className="text-sm font-medium text-amber-700">Potential Pending Revenue</p>
            <p className="text-3xl font-bold text-amber-800 mt-1">₹{potentialPendingRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-700">Confirmed Bookings</p>
            <p className="text-3xl font-bold text-blue-800 mt-1">{confirmedBookings.length}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Transaction History (Confirmed)</h3>
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          {confirmedBookings.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Room</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Guest Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dates</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {confirmedBookings.map(booking => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.roomName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{booking.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(booking.checkin).toLocaleDateString()} - {new Date(booking.checkout).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-800">₹{booking.totalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-slate-500 p-8">No confirmed transactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAccounting;
