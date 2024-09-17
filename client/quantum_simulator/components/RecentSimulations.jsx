import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RecentSimulations() {
  const [simulations, setSimulations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchRecentSimulations = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/simulations/recent', {
          headers: { 'x-auth-token': token },
        });
  
        console.log('Fetched simulations:', res.data);  // Debugging
        if (res.data && res.data.length > 0) {
          setSimulations(res.data);
        } else {
          setSimulations([]);  // No simulations found
        }
      } catch (err) {
        console.error('Error fetching recent simulations', err);
      }
    };
  
    fetchRecentSimulations();
  }, []);
  

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recent Simulations</h2>
      {simulations.length > 0 ? (
        <ul>
          {simulations.map((sim) => (
            <li
              key={sim.id}
              onClick={() => router.push(`/simulations/${sim.id}`)}
              className="cursor-pointer hover:text-indigo-600"
            >
              {sim.title} - {new Date(sim.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent simulations found.</p>
      )}
      <button
  onClick={async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/simulations/${id}`, {
        headers: { 'x-auth-token': token },
      });
      router.push('/dashboard');  // Redirect back to dashboard
    } catch (err) {
      console.error('Error deleting simulation', err);
    }
  }}
  className="mt-4 px-4 py-2 font-bold text-white bg-red-600 rounded-lg"
>
  Delete Simulation
</button>

    </div>
  );
}
