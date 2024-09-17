'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SimulationCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [algorithm, setAlgorithm] = useState('Grover');  // Default algorithm is Grover
  const [parameters, setParameters] = useState({});  // Dynamic parameters
  const [error, setError] = useState('');
  const router = useRouter();

  // Function to handle changes in the parameter fields
  const handleParameterChange = (key, value) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  // Dynamically render parameter fields based on the selected algorithm
  const renderParameterFields = () => {
    switch (algorithm) {
      case 'Grover':
        return (
          <>
            <div>
              <label className="block text-white">Number of Qubits (n)</label>
              <input
                type="number"
                onChange={(e) => handleParameterChange('n', e.target.value)}
                placeholder='Enter number of qubits'
                className="w-full px-4 py-2 mt-2 border rounded-lg text-black"
                required
              />
            </div>
            <div>
              <label className="block text-white">Target State</label>
              <input
                type="text"
                onChange={(e) => handleParameterChange('target_state', e.target.value)}
                placeholder='Enter target state'
                className="w-full px-4 py-2 mt-2 border rounded-lg text-black"
                required
              />
            </div>
          </>
        );
      case 'Shor':
        return (
          <>
            <div>
              <label className="block text-white">Number to Factor (N)</label>
              <input
                type="number"
                onChange={(e) => handleParameterChange('N', e.target.value)}
                placeholder='Enter number to factor'
                className="w-full px-4 py-2 mt-2 border rounded-lg text-black"
                required
              />
            </div>
          </>
        );
      case 'Schrodinger':
        return (
          <>
            <div>
              <label className="block text-white">Potential Energy (V)</label>
              <input
                type="text"
                onChange={(e) => handleParameterChange('V', e.target.value)}
                placeholder='Enter potential energy'
                className="w-full px-4 py-2 mt-2 border rounded-lg text-black"
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // POST request to create a new simulation
      const res = await axios.post(
        'http://localhost:8080/api/simulations',
        {
          title,
          description,
          algorithm,
          parameters,  // Already structured as key-value pairs
        },
        {
          headers: { 'x-auth-token': token },
        }
      );

      if (res.status === 201) {
        const simulationId = res.data.id;
        router.push(`/simulations/${simulationId}`);  // Redirect to simulation details
      }
    } catch (err) {
      console.error(err);
      setError('Error creating simulation. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-white">Create New Simulation</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none text-black"
          />
        </div>

        <div>
          <label className="block text-white">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for the simulation"
            required
            className="w-full px-4 py-2 mt-2 border rounded-lg text-black"
          />
        </div>

        <div>
          <label className="block text-white">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg text-black"
          >
            <option value="Grover">Grover's Algorithm</option>
            <option value="Shor">Shor's Algorithm</option>
            <option value="Schrodinger">Schrodinger's Equation</option>
          </select>
        </div>

        {renderParameterFields()}  {/* Render dynamic parameter inputs */}

        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
        >
          Create Simulation
        </button>
      </form>
    </div>
  );
};

export default SimulationCreate;
