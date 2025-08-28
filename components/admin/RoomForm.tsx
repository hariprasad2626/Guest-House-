import React, { useState, useEffect } from 'react';
import { Room } from '../../types';

interface RoomFormProps {
  room: Room | null;
  onSave: (room: Room) => void;
  onClose: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ room, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Room, 'id' | 'amenities' | 'images' | 'bookings'>>({
    name: '',
    description: '',
    pricePerNight: 0,
    maxGuests: 1,
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        description: room.description,
        pricePerNight: room.pricePerNight,
        maxGuests: room.maxGuests,
      });
      setImagePreviews(room.images);
    }
  }, [room]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roomDataToSave: Room = {
        ...formData,
        id: room?.id || Date.now(),
        images: imagePreviews.length > 0 ? imagePreviews : ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop'],
        amenities: room?.amenities || [],
        bookings: room?.bookings || [], // Preserve existing bookings on edit
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
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-slate-600">Upload Images</label>
            <input type="file" name="images" id="images" onChange={handleImageChange} multiple accept="image/*" className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative group">
                    <img src={src} alt={`Preview ${index+1}`} className="w-full h-24 object-cover rounded-md" />
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                  </div>
                ))}
              </div>
            )}
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