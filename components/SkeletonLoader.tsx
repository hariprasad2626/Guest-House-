import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-100 border-t border-slate-200">
            <div className="container mx-auto px-4 py-8 max-w-6xl text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} ISKCON Newtown Guest House. All rights reserved.</p>
                <p className="text-sm mt-2">Stay close to the temple. Experience peace and comfort.</p>
            </div>
        </footer>
    );
};

export default Footer;