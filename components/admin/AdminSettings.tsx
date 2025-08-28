import React, { useState } from 'react';

interface AdminSettingsProps {
  settings: { upiId: string };
  onUpdateSettings: (settings: { upiId: string }) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onUpdateSettings }) => {
  const [upiId, setUpiId] = useState(settings.upiId);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ upiId });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000); // Hide message after 3 seconds
  };

  return (
    <div className="max-w-xl">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Application Settings</h3>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
        <div>
          <label htmlFor="upiId" className="block text-sm font-medium text-slate-600">
            Payment UPI ID
          </label>
          <input
            type="text"
            id="upiId"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder="your-name@upi"
            required
          />
          <p className="text-xs text-slate-500 mt-1">This UPI ID will be shown to customers on the payment screen.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
          >
            Save Settings
          </button>
          {saved && <p className="text-sm text-green-600 font-medium">Settings saved successfully!</p>}
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
