"use client"
import { useRouter } from "next/navigation"

const Navbar = () => {
  const router = useRouter()
  
  return (
  
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 mt-4 rounded-lg flex py-4 px-8 items-center justify-between shadow-lg">
      <h1 className="font-bold uppercase text-white text-3xl">Quotifier</h1>
      <ul className="flex gap-[40px] text-white">
        <li>
          <button 
            onClick={() => router.push('/')}
            className="hover:text-gray-200 transition-colors duration-300 text-lg font-medium"
          >
            
            Home
          </button>
        </li>
        <li>
          <button 
            onClick={() => router.push('/Favorites')}
            className="hover:text-gray-200 transition-colors duration-300 text-lg font-medium"
          >
            Favorites
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
