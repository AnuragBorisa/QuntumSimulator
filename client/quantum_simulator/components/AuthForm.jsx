'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthForm = ({ mode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = 'http://localhost:8080/api/auth/login'; // Default to login
      const payload = { email, password };

      if (mode === 'register') {
        url = role === 'student' 
          ? 'http://localhost:8080/api/auth/register/student' 
          : 'http://localhost:8080/api/auth/register/user';
        payload['name'] = name; // Include name when registering
      }

      // Make the API call
      const res = await axios.post(url, payload);
      
      if (res.status === 200) {
        const { token, role: userRole } = res.data; // Get role from backend response
        localStorage.setItem('token', token); 
        localStorage.setItem('role', userRole); // Set the role from backend, not the registration form
        router.push('/'); // Redirect to homepage
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      {mode === 'register' && (
        <div>
          <label>Name</label>
          <input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-100 text-black"
          />
        </div>
      )}

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-100 text-black"
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-100 text-black"
        />
      </div>

      {mode === 'register' && (
        <div>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-100 text-black"
          >
            <option value="user">Normal User</option>
            <option value="student">Student</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
      >
        {mode === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;
