'use client';

import React, { useEffect, useState } from 'react';

type Account = {
  id: string;
  name: string;
  type: string;
  opening_balance?: number;
  current_balance?: number;
  is_locked?: boolean;
  site?: { id: string; name: string };
  party?: { id: string; name: string };
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch('/api/accounts'); // Adjust to your API route
        if (!res.ok) throw new Error('Failed to fetch accounts');
        const data = await res.json();
        setAccounts(data.docs || []);
      } catch (err) {
        setError('Failed to load accounts.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Accounts List</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Site</th>
                <th className="text-left p-3">Party</th>
                <th className="text-left p-3">Opening Balance</th>
                <th className="text-left p-3">Current Balance</th>
                <th className="text-center p-3">Locked</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{acc.name}</td>
                  <td className="p-3 capitalize">{acc.type}</td>
                  <td className="p-3">{acc.site?.name || '-'}</td>
                  <td className="p-3">{acc.party?.name || '-'}</td>
                  <td className="p-3">{acc.opening_balance ?? 0}</td>
                  <td className="p-3">{acc.current_balance ?? 0}</td>
                  <td className="text-center p-3">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        acc.is_locked ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    ></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
