import React from 'react';

interface AmenityChipProps {
  name: string;
  icon: string; // Now accepts a raw SVG string
}

const AmenityChip: React.FC<AmenityChipProps> = ({ name, icon }) => {
  return (
    <div className="flex items-center gap-2 bg-blue-50 text-blue-800 font-semibold px-4 py-2 rounded-full border border-blue-200">
      <span className="h-5 w-5" dangerouslySetInnerHTML={{ __html: icon }} />
      <span>{name}</span>
    </div>
  );
};

export default AmenityChip;