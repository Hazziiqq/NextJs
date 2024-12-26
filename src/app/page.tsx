'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-black"> {/* Black background for the page */}
      <div className="text-center px-8 py-10 max-w-lg rounded-lg shadow-lg bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 bg-opacity-80 backdrop-blur-md h-96 flex flex-col justify-center"> {/* Card with fixed height and gradient background */}
        <h1 className="text-4xl font-semibold mb-4 text-white">Welcome to Quotifier</h1>
        <p className="text-lg mb-6 text-white">A place where you can find and save your favorite quotes from the best minds in history.</p>
        <h2 className="text-3xl font-bold mb-8 text-white">Your quotes journey starts here</h2>
        <div className="mt-6">
          <button 
            onClick={() => router.push('/Home')} // Route to home page
            className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-lg text-xl transition duration-300 shadow-md"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
