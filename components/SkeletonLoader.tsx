import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-100 border-t border-slate-200">
            <div className="container mx-auto px-4 py-8 max-w-6xl text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} Serene Escapes. All rights reserved.</p>
                <p className="text-sm mt-2">A beautiful guesthouse experience. (This is a demo application)</p>
            </div>
        </footer>
    );
};

export default Footer;