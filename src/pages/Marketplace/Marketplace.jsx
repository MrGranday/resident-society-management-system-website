import { useState, useEffect } from 'react';
import './Marketplace.css';

export default function Marketplace() {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch listings from API
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/listings');
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.type === filter;
  });

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h1>Property Marketplace</h1>
        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'sale' ? 'active' : ''}`}
            onClick={() => setFilter('sale')}
          >
            For Sale
          </button>
          <button 
            className={`filter-btn ${filter === 'rent' ? 'active' : ''}`}
            onClick={() => setFilter('rent')}
          >
            For Rent
          </button>
        </div>
      </div>

      <div className="listings-grid">
        {filteredListings.map(listing => (
          <div key={listing._id} className="listing-card">
            <img src={listing.images[0]} alt={listing.title} />
            <div className="listing-content">
              <h3>{listing.title}</h3>
              <p className="price">${listing.price.toLocaleString()}</p>
              <p className="location">{listing.location}</p>
              <div className="listing-details">
                <span>{listing.bedrooms} beds</span>
                <span>{listing.bathrooms} baths</span>
                <span>{listing.area} sqft</span>
              </div>
              <button className="contact-btn">Contact Owner</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}