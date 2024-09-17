'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function EditSimulation({ params }) {
  const [simulation, setSimulation] = useState(null);
  const [title, setTitle] = useState('');
  const [algorithm, setAlgorithm] = useState('Grover');
  const [parameters, setParameters] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchSimulation = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/simulations/${id}`, {
          headers: { 'x-auth-token': token }, // Correct Bearer token usage
        });
        const sim = res.data;
        setSimulation(sim);
        setTitle(sim.title);
        setAlgorithm(sim.algorithm);
        setParameters(JSON.stringify(sim.parameters));
      } catch (err) {
        console.error('Error fetching simulation details', err);
        setError('Error fetching simulation.');
      }
    };

    fetchSimulation();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `http://localhost:8080/api/simulations/${id}`,
        {
          title,
          algorithm,
          parameters: JSON.parse(parameters), // Ensure parameters are parsed
        },
        {
          headers: { 'x-auth-token': token }, // Use Bearer token
        }
      );

      router.push('/dashboard');
    } catch (err) {
      console.error('Error updating simulation', err);
      setError('Error updating simulation.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!simulation) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Simulation</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
          >
            <option value="Grover">Grover's Algorithm</option>
            <option value="Shor">Shor's Algorithm</option>
            {/* Add more algorithms */}
          </select>
        </div>

        <div>
          <label className="block">Parameters (JSON Format)</label>
          <textarea
            value={parameters}
            onChange={(e) => setParameters(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
        >
          Update Simulation
        </button>
      </form>
    </div>
  );
}
