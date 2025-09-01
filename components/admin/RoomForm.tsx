import React, { useState, useEffect } from 'react';
import { Room, ALL_AMENITIES, Amenity } from '../../types';

interface RoomFormProps {
  room: Room | null;
  onSave: (payload: any) => void;
  onClose: () => void;
}

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


const RoomForm: React.FC<RoomFormProps> = ({ room, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Room, 'id' | 'amenities' | 'images' | 'bookings'>>({
    name: '',
    description: '',
    pricePerNight: 0,
    maxGuests: 1,
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);


  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        description: room.description,
        pricePerNight: room.pricePerNight,
        maxGuests: room.maxGuests,
      });
      setExistingImages(room.images || []);
      setSelectedAmenities(room.amenities || []);
    }
  }, [room]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleAmenityChange = (amenity: Amenity, isChecked: boolean) => {
    if (isChecked) {
      setSelectedAmenities(prev => [...prev, amenity]);
    } else {
      setSelectedAmenities(prev => prev.filter(a => a.name !== amenity.name));
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newImagesPayload = await Promise.all(
        newImages.map(async (file) => {
            const base64 = await fileToBase64(file);
            return {
                mimeType: file.type,
                data: base64.split(',')[1], // Send only the base64 part
                fileName: file.name
            };
        })
    );

    const roomDataToSave = {
        ...formData,
        id: room?.id || 0, // Backend will assign new ID if 0
        existingImages: existingImages,
        newImages: newImagesPayload,
        amenities: selectedAmenities, // Use the new state for amenities
        bookings: room?.bookings || [],
    };
    onSave(roomDataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-6">{room ? 'Edit Room' : 'Add New Room'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-600">Room Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full input" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-600">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full input" required />
          </div>
          
          {/* Amenities Management */}
          <div>
            <label className="block text-sm font-medium text-slate-600">Amenities</label>
            <div className="mt-2 grid grid-cols-2 gap-4 border border-slate-200 p-4 rounded-md">
              {ALL_AMENITIES.map(amenity => (
                <div key={amenity.name} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity.name}`}
                    name={amenity.name}
                    checked={selectedAmenities.some(a => a.name === amenity.name)}
                    onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor={`amenity-${amenity.name}`} className="ml-3 text-sm text-slate-700">{amenity.name}</label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Image Management */}
          <div>
            <label className="block text-sm font-medium text-slate-600">Images</label>
            <div className="mt-2 grid grid-cols-3 gap-4">
              {existingImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img src={url} alt={`Existing image ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                  <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
              ))}
              {newImages.map((file, index) => (
                <div key={index} className="relative group">
                   <img src={URL.createObjectURL(file)} alt={`New image ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                   <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label htmlFor="imageUpload" className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-2 px-4 rounded-lg">
                Upload New Images
              </label>
              <input type="file" id="imageUpload" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          </div>
          
          <div>
            <label htmlFor="pricePerNight" className="block text-sm font-medium text-slate-600">Price per Night (₹)</label>
            <input type="number" name="pricePerNight" id="pricePerNight" value={formData.pricePerNight} onChange={handleChange} className="mt-1 block w-full input" required />
          </div>
          <div>
            <label htmlFor="maxGuests" className="block text-sm font-medium text-slate-600">Max Guests</label>
            <input type="number" name="maxGuests" id="maxGuests" value={formData.maxGuests} onChange={handleChange} className="mt-1 block w-full input" min="1" required />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">
              Cancel
            </button>
            <button type="submit" className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700">
              Save Room
            </button>
          </div>
        </form>
      </div>
       <style>{`.input { border: 1px solid #cbd5e1; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%; } .input:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: #14b8a6; box-shadow: 0 0 0 2px #14b8a6; }`}</style>
    </div>
  );
};

export default RoomForm;