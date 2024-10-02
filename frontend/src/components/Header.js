import React from "react";
import { Link } from "react-router-dom";
// import { Search } from 'lucide-react';

const Header = () => (
  <header className="bg-red-600 text-white p-4">
    <nav className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mr-2">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15v5a2 2 0 0 1-2 2h-5" />
          <path d="M21 15a5 5 0 0 0-5-5c-2.76 0-5 2.24-5 5" />
          <path d="M17 15h-1" />
        </svg>
        Zomato Finder
      </Link>
      <div className="space-x-4">
        <Link to="/" className="hover:text-red-200 transition-colors">
          Home
        </Link>
        <Link
          to="/search/location"
          className="hover:text-red-200 transition-colors"
        >
          Location Search
        </Link>
        <Link
          to="/restaurants/advanced-search"
          className="hover:text-red-200 transition-colors"
        >
          Advanced Search
        </Link>
        <Link
          to="/search/image"
          className="hover:text-red-200 transition-colors"
        >
          Image Search
        </Link>
        
      </div>
    </nav>
  </header>
);

export default Header;
