
import React, { useState } from 'react';
import { AppSettings } from '../../types';

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


interface AdminSettingsProps {
  settings: AppSettings;
  onUpdateSettings: (payload: any) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onUpdateSettings }) => {
  const [upiId, setUpiId] = useState(settings.upiId);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let homepageImageData = undefined;
    if (newImageFile) {
      const base64 = await fileToBase64(newImageFile);
      homepageImageData = {
        mimeType: newImageFile.type,
        data: base64.split(',')[1],
        fileName: newImageFile.name,
      };
    }

    const payload = {
      upiId,
      homepageImageData,
    };
    
    onUpdateSettings(payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currentImageUrl = imagePreview || settings.homepageImageUrl;


  return (
    <div className="max-w-xl">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Application Settings</h3>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 space-y-6">
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

        <div>
          <label className="block text-sm font-medium text-slate-600">
            Homepage Image
          </label>
          <div className="mt-2 flex items-center gap-4">
            <div className="w-48 h-28 bg-slate-100 rounded-md overflow-hidden border">
              {currentImageUrl ? (
                <img src={currentImageUrl} alt="Homepage preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Image</div>
              )}
            </div>
            <div>
              <label htmlFor="homepageImageUpload" className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-2 px-4 rounded-lg">
                Upload New Image
              </label>
              <input type="file" id="homepageImageUpload" accept="image/*" onChange={handleFileChange} className="hidden" />
              <p className="text-xs text-slate-500 mt-2">Recommended: a wide, scenic photo.</p>
            </div>
          </div>
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
