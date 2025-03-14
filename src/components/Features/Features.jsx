import { FaHome, FaCalendar, FaStore, FaComments, FaChartLine, FaUserLock } from 'react-icons/fa';
import FeatureCard from './FeatureCard/FeatureCard';
import './Features.css';

const features = [
  {
    icon: <FaHome />,
    title: "Issue Management",
    description: "Report and track maintenance issues with real-time updates on resolution status."
  },
  {
    icon: <FaCalendar />,
    title: "Community Events",
    description: "Stay updated with community events and participate in society activities."
  },
  {
    icon: <FaStore />,
    title: "Marketplace",
    description: "List and browse properties for sale or rent within your society."
  },
  {
    icon: <FaComments />,
    title: "Communication Hub",
    description: "Efficient communication channel between residents and management."
  },
  {
    icon: <FaChartLine />,
    title: "Progress Tracking",
    description: "Monitor issue resolution and management performance through intuitive dashboards."
  },
  {
    icon: <FaUserLock />,
    title: "Role-Based Access",
    description: "Personalized interfaces for residents, management, and administrators."
  }
];

export default function Features() {
  return (
    <section id="features" className="features">
      <div className="features-header">
        <span className="section-tag">Features</span>
        <h2>Everything you need to manage your community</h2>
        <p className="section-subtitle">
          Powerful tools designed to make community management effortless
        </p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}