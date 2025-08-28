import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentInfo: { screenshot?: File; comments: string }) => void;
  roomName: string;
  totalAmount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roomName,
  totalAmount,
}) => {
  const [screenshot, setScreenshot] = useState<File | undefined>();
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  
  const upiId = 'dasosmi@icici';
  const payeeName = 'Serene Escapes';
  const qrData = encodeURIComponent(`upi://pay?pa=${upiId}&pn=${payeeName}&am=${totalAmount}&cu=INR`);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) {
      setError('Please upload a screenshot as proof of payment.');
      return;
    }
    setError('');
    onSubmit({ screenshot, comments });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setScreenshot(e.target.files[0]);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h3 className="text-xl font-bold text-slate-800">Complete Your Booking</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-2xl font-bold">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4">
          <p className="text-slate-600">Please complete the payment to request your booking for <span className="font-bold">{roomName}</span>.</p>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-sm text-slate-500">Total Amount</p>
            <p className="text-3xl font-bold text-slate-800">₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="flex flex-col items-center">
            <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 rounded-lg border" />
            <p className="mt-2 text-sm text-slate-600">Scan to pay with any UPI app</p>
            <p className="font-semibold text-slate-800">UPI ID: {upiId}</p>
          </div>
          
          <div>
            <label htmlFor="screenshot" className="block text-sm font-medium text-slate-600">Upload Payment Screenshot</label>
            <input 
              type="file" 
              id="screenshot" 
              name="screenshot"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-slate-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-teal-50 file:text-teal-700
                         hover:file:bg-teal-100"
              required 
            />
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-slate-600">Comments (Optional)</label>
            <textarea 
              id="comments" 
              name="comments" 
              rows={3} 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="Any special requests?"
            />
          </div>
          
          {error && <p className="text-red-600 text-sm">{error}</p>}
          
          <div className="pt-4 border-t mt-4 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">
              Cancel
            </button>
            <button type="submit" className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700">
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
