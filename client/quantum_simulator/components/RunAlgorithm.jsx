import { useState } from 'react';
import axios from 'axios';
import QuantumChart from './QuantumChart'; // Import the QuantumChart component

export default function RunAlgorithm({ algorithm, parameters }) {
  const [result, setResult] = useState(null); // Store result as an object
  const [chartType, setChartType] = useState('bar'); // Default chart type
  const [error, setError] = useState('');

  const handleRunAlgorithm = async () => {
    const token = localStorage.getItem('token');

    // Convert `n` to an integer and ensure the target_state is a binary string of correct length
    const parsedN = parseInt(parameters.n, 10);
    const targetState = parameters.target_state;

    if (targetState.length !== parsedN) {
      setError(`Target state length (${targetState.length}) does not match number of qubits (n=${parsedN})`);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:8080/api/algorithm/run',
        {
          algorithm,
          n: parsedN,
          target_state: targetState,
        },
        {
          headers: { 'x-auth-token': token },
        }
      );

      if (res.data.error) {
        setError(res.data.error);  // Log error from backend
        console.error(res.data.error);  // Print error for debugging
      } else {
        setResult(res.data.result); // Directly set result, no need to parse it again
      }
    } catch (err) {
      console.error('Error running the algorithm', err);
      setError('Error running the algorithm: ' + err.response?.data?.error || err.message); // Log exact error
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleRunAlgorithm}
        className="mt-4 px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
      >
        Run Algorithm
      </button>

      {/* Visualization of the result */}
      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Visualization</h3>

          <div className="mb-4">
            <label>Select Chart Type: </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-2 py-2 border rounded-lg bg-black"
            >
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>

          {/* Pass the result to the QuantumChart component */}
          <QuantumChart data={result} chartType={chartType} />
        </div>
      )}
    </div>
  );
}
