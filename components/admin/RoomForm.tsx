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
  const [imageUrls, setImageUrls] = useState('');

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        description: room.description,
        pricePerNight: room.pricePerNight,
        maxGuests: room.maxGuests,
      });
      setImageUrls(room.images.join(', '));
    }
  }, [room]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roomDataToSave: Room = {
        ...formData,
        id: room?.id || 0, // Backend will assign new ID if 0
        images: imageUrls.split(',').map(url => url.trim()).filter(url => url),
        amenities: room?.amenities || [],
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
          <div>
            <label htmlFor="imageUrls" className="block text-sm font-medium text-slate-600">Image URLs</label>
            <textarea name="imageUrls" id="imageUrls" value={imageUrls} onChange={(e) => setImageUrls(e.target.value)} rows={3} className="mt-1 block w-full input" placeholder="https://.../image1.jpg, https://.../image2.jpg" required />
            <p className="text-xs text-slate-500 mt-1">Paste image URLs, separated by commas.</p>
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