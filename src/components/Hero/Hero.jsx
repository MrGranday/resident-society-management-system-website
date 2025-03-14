import { FaArrowRight } from 'react-icons/fa';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Transform Your Community Management
        </h1>
        <p className="hero-subtitle">
          Streamline operations, enhance communication, and build stronger communities 
          with our comprehensive digital solution.
        </p>
        {/* <div className="hero-buttons">
          <a href="#features" className="button primary">
            Get Started <FaArrowRight style={{ marginLeft: '0.5rem' }} />
          </a>
          <a href="#demo" className="button secondary">
            Watch Demo
          </a>
        </div> */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Communities</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50k+</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
        </div>
      </div>
      <div className="floating-cards">
        <div className="floating-card card-1">
          <div className="card-icon">📊</div>
          <div className="card-text">Real-time Analytics</div>
        </div>
        <div className="floating-card card-2">
          <div className="card-icon">🏠</div>
          <div className="card-text">Smart Management</div>
        </div>
      </div>
    </section>
  );
}