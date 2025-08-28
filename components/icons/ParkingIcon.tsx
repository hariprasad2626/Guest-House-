
import React from 'react';

const ParkingIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V5m0 0 3 3m-3-3L9 8m-3 4h12M4.75 21V9.25A2.25 2.25 0 017 7h10a2.25 2.25 0 012.25 2.25V21" />
    </svg>
);

export default ParkingIcon;
