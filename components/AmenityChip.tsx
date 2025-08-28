
import React from 'react';
import { AmenityIconType } from '../types';
import WifiIcon from './icons/WifiIcon';
import PoolIcon from './icons/PoolIcon';
import KitchenIcon from './icons/KitchenIcon';
import AirConIcon from './icons/AirConIcon';
import ParkingIcon from './icons/ParkingIcon';
import TvIcon from './icons/TvIcon';
import PetsIcon from './icons/PetsIcon';
import GymIcon from './icons/GymIcon';

interface AmenityChipProps {
  name: string;
  icon: AmenityIconType;
}

const iconMap: Record<AmenityIconType, React.ReactNode> = {
    [AmenityIconType.WIFI]: <WifiIcon />,
    [AmenityIconType.POOL]: <PoolIcon />,
    [AmenityIconType.KITCHEN]: <KitchenIcon />,
    [AmenityIconType.AC]: <AirConIcon />,
    [AmenityIconType.PARKING]: <ParkingIcon />,
    [AmenityIconType.TV]: <TvIcon />,
    [AmenityIconType.PETS]: <PetsIcon />,
    [AmenityIconType.GYM]: <GymIcon />,
};

const AmenityChip: React.FC<AmenityChipProps> = ({ name, icon }) => {
  return (
    <div className="flex items-center gap-2 bg-blue-50 text-blue-800 font-semibold px-4 py-2 rounded-full border border-blue-200">
      {iconMap[icon] || null}
      <span>{name}</span>
    </div>
  );
};

export default AmenityChip;
