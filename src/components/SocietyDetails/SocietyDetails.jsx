import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SocietyDetails.css';

export default function SocietyDetails() {
  const { id } = useParams();
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSocietyDetails();
  }, [id]);

  const fetchSocietyDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/societies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Log the response for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        // Handle non-200 responses
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const data = await response.json(); // Parse the response as JSON
      setSociety(data);
    } catch (error) {
      console.error('Error fetching society details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!society) {
    return <div>No society found.</div>;
  }

  return (
    <div className="society-details">
      <h1>{society.name}</h1>
      <p><strong>Address:</strong> {society.address}</p>
      <p><strong>Date of Creation:</strong> {new Date(society.date).toLocaleDateString()}</p>
      <p><strong>Unique ID Code:</strong> {society.uniqueIdCode}</p>
      <h2>Manager Details</h2>
      <p><strong>Name:</strong> {society.manager?.name}</p>
      <p><strong>Email:</strong> {society.manager?.email}</p>
      <h2>Residents</h2>
      {society.residents && society.residents.length > 0 ? (
        <ul>
          {society.residents.map((resident) => (
            <li key={resident._id}>
              <p><strong>Name:</strong> {resident.name}</p>
              <p><strong>Email:</strong> {resident.email}</p>
              <p><strong>House Number:</strong> {resident.houseNumber}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No residents found.</p>
      )}
    </div>
  );
}