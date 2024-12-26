/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import axios from 'axios';
import React, { useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


const HomePage = () => {
  const [search, setSearch] = useState('');
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<any[]>([]);

  const onChangerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!search.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/quotes?query=${search}`);
      const data = await res.json();
      console.log(res);
      
      if (res.ok) {
        setQuotes(data.quotes);
      } else {
        setError(data.error || 'Failed to fetch quotes');
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  const addToFav = async (quote: any) => {
 
    if (!search.trim()) {
      setError('Search term cannot be empty when adding to favorites.');
      return;
    }

    try {
      console.log('Adding to Favorites:', {
        word: search,
        quoteText: quote.quoteText,
        author: quote.author,
      });
  
      const res = await axios.post('/api/favorites', {
        word: search, 
        quoteText: quote.quoteText,
        author: quote.author || '', 
      });
      
  
      if (res.status === 200) {
        setFavorites((prev) => [...prev, quote]);
        toast.success(res.data.message);
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
      console.log(error.message);
    }
  };

  return (
    
    <div>
      <ToastContainer theme="dark"/>
      <form onSubmit={onSubmitHandler} className="flex flex-start flex-col gap-2 w-[80%] max-w-[600px] mt-24 px-2 mx-auto text-black">
        <input 
          type="text"
          name="search"
          value={search}
          onChange={onChangerHandler}
          placeholder="Search for a quote"
          className="px-3 py-2 border-2 w-full rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button type="submit" className="bg-orange-500 py-3 px-11 hover:bg-orange-600 rounded-lg shadow-md text-white font-semibold" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      <div className="mt-8">
        {quotes.length > 0 ? (
          quotes.map((quote, index) => (
            <div key={index} className="quote-card p-6 mb-6 border border-gray-200 rounded-lg shadow-lg bg-gray-50">
              <p className="quote-text text-xl font-serif italic text-gray-800">{quote.quoteText}</p>
              <p className="author-name mt-4 text-sm font-light text-gray-600">- {quote.author}</p>
              <button
                onClick={() => addToFav(quote)}
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg shadow-md text-sm"
              >
                Add to Favorites
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No quotes found.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
