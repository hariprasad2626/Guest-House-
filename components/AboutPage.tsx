import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in my-8">
            <div className="relative h-64">
                <img 
                    src="https://images.unsplash.com/photo-1582510014285-816694589f66?q=80&w=1974&auto=format&fit=crop" 
                    alt="ISKCON Newtown Temple"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight text-center">About ISKCON Newtown Guest House</h1>
                </div>
            </div>
            <div className="p-8 md:p-12">
                <div className="max-w-3xl mx-auto">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            Welcome to the ISKCON Newtown Guest House. Our primary mission is to provide a comfortable, peaceful, and spiritually uplifting stay for visitors, devotees, and guests attending the temple. We aim to create a serene environment that complements your visit to the holy temple grounds.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Located conveniently close to the temple, our guesthouse offers a tranquil retreat from the everyday. We strive to provide clean, modern accommodations and warm, friendly service to ensure your stay is both memorable and comfortable.
                        </p>
                    </section>
                    <section className="mt-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">What We Offer</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600">
                            <li className="flex items-start gap-4">
                                <span className="text-teal-500 font-bold text-xl mt-1">&#10003;</span>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Spiritual Ambiance</h3>
                                    <p>Experience a peaceful atmosphere designed to enhance your spiritual journey and visit to the temple.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="text-teal-500 font-bold text-xl mt-1">&#10003;</span>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Comfortable Stays</h3>
                                    <p>Clean, well-maintained rooms with essential amenities to ensure you have a restful stay.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4">
                                <span className="text-teal-500 font-bold text-xl mt-1">&#10003;</span>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Proximity to Temple</h3>
                                    <p>Our prime location allows for easy and convenient access to all temple activities and events.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4">
                                <span className="text-teal-500 font-bold text-xl mt-1">&#10003;</span>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Dedicated Service</h3>
                                    <p>Our staff is here to assist you and make your visit as smooth and pleasant as possible.</p>
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