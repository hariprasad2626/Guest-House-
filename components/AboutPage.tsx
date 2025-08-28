import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in my-8">
            <div className="relative h-64">
                <img 
                    src="https://images.unsplash.com/photo-1562778612-e1e073d31530?q=80&w=2070&auto=format&fit=crop" 
                    alt="Lobby of Serene Escapes"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">About Serene Escapes</h1>
                </div>
            </div>
            <div className="p-8 md:p-12">
                <div className="max-w-3xl mx-auto">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Story</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Founded in 2023, Serene Escapes was born from a simple idea: to create a peaceful sanctuary where guests can unwind, reconnect, and experience genuine hospitality. We envisioned a place that combines the comfort of home with the quiet luxury of a boutique guesthouse. 
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Nestled away from the hustle and bustle, our guesthouse is designed to be your personal retreat. Every room, every space, and every detail has been thoughtfully curated to promote tranquility and relaxation. We believe that a great stay is about more than just a comfortable bed—it's about creating lasting memories.
                        </p>
                    </section>
                    <section className="mt-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">What We Offer</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600">
                            <li className="flex items-start gap-4">
                                <span className="text-teal-500 font-bold text-xl mt-1">&#10003;</span>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Exceptional Comfort</h3>
                                    <p>Beautifully appointed rooms with modern amenities designed for your ultimate comfort.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="text-teal-500 font-bold text-xl mt-1">&#10003;</span>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Personalized Service</h3>
                                    <p>Our friendly staff is dedicated to making your stay perfect, from check-in to check-out.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4">
                                <span className="text-teal-500 font-bold text-xl mt-1">&#10003;</span>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Peaceful Ambiance</h3>
                                    <p>Enjoy our lush gardens, serene common areas, and a quiet atmosphere perfect for relaxation.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4">
                                <span className="text-teal-500 font-bold text-xl mt-1">&#10003;</span>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Prime Location</h3>
                                    <p>Conveniently located to offer both seclusion and easy access to local attractions.</p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;