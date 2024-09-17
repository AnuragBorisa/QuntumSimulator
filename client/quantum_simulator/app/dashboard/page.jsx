'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RecentSimulations from "../../components/RecentSimulations";

const DashboardPage = () => {
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleFromStorage = localStorage.getItem("role");
    console.log(roleFromStorage, "role");

    // Redirect to login if no token or role found
    if (!token || !roleFromStorage) {
      router.push("/auth/login");
      return;
    }

    setRole(roleFromStorage); // Set the role in state from localStorage
  }, [router]);

  // Handle "Create New Simulation" button click
  const handleCreateSimulation = () => {
    router.push("/simulations/create"); // Redirect to the create simulation page
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {role === "student" ? (
        <>
          <p>Welcome, Student! Here are your recent simulations:</p>
          <RecentSimulations /> {/* Render recent simulations for students */}

          {/* Add Create New Simulation button */}
          <button
            onClick={handleCreateSimulation}
            className="mt-4 px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
          >
            Create New Simulation
          </button>
        </>
      ) : (
        <>
          <p>Welcome! Run your quantum simulation below:</p>
          {/* Add your run simulation logic here */}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
