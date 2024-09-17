'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import RunAlgorithm from '../../../components/RunAlgorithm'; // Import the RunAlgorithm component

export default function SimulationDetails({ params }) {
  const [simulation, setSimulation] = useState(null);
  const [error, setError] = useState('');
  const { id } = params;

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchSimulation = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/simulations/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setSimulation(res.data);
      } catch (err) {
        console.error(err);
        setError('Error fetching simulation details.');
      }
    };

    fetchSimulation();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!simulation) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{simulation.title}</h2>
      <p><strong>Algorithm:</strong> {simulation.algorithm}</p>
      <p><strong>Parameters:</strong> {JSON.stringify(simulation.parameters)}</p>
      {/* <p><strong>Results:</strong> {simulation.results ? JSON.stringify(simulation.results) : 'No results available'}</p> */}

      {/* Use the RunAlgorithm component and pass the algorithm and parameters */}
      <RunAlgorithm 
        algorithm={simulation.algorithm} 
        parameters={simulation.parameters} 
      />

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-4 px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
