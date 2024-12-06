"use client";
import React from 'react';
import { useRouter } from 'next/navigation'

const Logout = () => {
    const router = useRouter()

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'DELETE',
    });

    if (res.ok) {
      // Redirect to login or show logged-out state
      router.push('/sign-up');
    } else {
      console.error('Failed to logout');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center p-6 gap-4 bg-gray-300 rounded-md shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Logout</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;