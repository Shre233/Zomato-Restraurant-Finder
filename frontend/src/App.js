import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import LocationSearchPage from './pages/LocationSearchPage';
import AdvancedSearchPage from './pages/AdvanceSearchPage';
import './App.css';
import SearchImage from './pages/SearchImage';

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurants" element={<RestaurantList />} />
      <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
      <Route path="/restaurants/advanced-search" element={<AdvancedSearchPage />} />
      <Route path="/search/location" element={<LocationSearchPage />} />
      <Route path="/search/image" element={<SearchImage />} />
    </Routes>
  </Router>
);

export default App;