/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


interface FavoriteQuote {
  _id: string; 
  quoteText: string;
  author: string;
}

const FavPage = () => {

  const [displayFav, setDisplayFav] = useState<FavoriteQuote[]>([])
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('/api/favorites');
        if (res.data.favorites) {
          setDisplayFav(res.data.favorites); 
        }
      } catch (error: any) {
        setError(`Error: ${error.message}`);
        console.log(error.message);
      }
    };

    fetchFavorites();
  }, []);

  const removeFromFav = async (id: string) => {
    try {
     
      const res = await axios.delete('/api/favorites', { data: { id } });
      if (res.status === 200) {
        setDisplayFav((prevFavs) => prevFavs.filter((fav) => fav._id !== id));
        toast.success(res.data.message);

      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
      console.log(error.message);
    }
  }

  return (
    <div>
      <ToastContainer theme='dark'/>
    <div className="mt-4">
      {error && <p className="text-red-500 text-center">{error}</p>}
      {displayFav.length > 0 ? (
        displayFav.map((fav) => (
          <div key={fav._id} className="mt-4 quote-card p-6 border border-gray-200 rounded-lg shadow-lg bg-gray-50">
            <p className="quote-text text-xl font-serif italic text-gray-800">{fav.quoteText}</p>
            <p className="author-name mt-4 text-sm font-light text-gray-600">- {fav.author}</p>
            <button
              onClick={() => removeFromFav(fav._id)} // Pass the favorite's _id to remove
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md text-sm"
            >
              Remove from Favorites
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600 col-span-full">No favorites found.</p>
      )}
    </div>
    </div>
  );
}

export default FavPage;
