import { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from '../Login/Login';
import './Navbar.css';

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="logo">RSMS</Link>
          <div className="nav-links">
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/features">Features</Link>
            <Link to="/contact">Contact</Link>
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>
          </div>
        </div>
      </nav>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
}