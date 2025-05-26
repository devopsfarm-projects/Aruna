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
        const res = await fetch('/api/accounts'); 
        if (!res.ok) throw new Error('Failed to fetch accounts');
        const data = await res.json();
        setAccounts(data.docs || []);
      } catch (err: unknown) {
        setError(`Failed to load accounts: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen pt-36 bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
          <span className="text-indigo-600 dark:text-indigo-400">Accounts</span> List
        </h1>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 dark:border-indigo-400 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400 py-8">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            <table className="min-w-full">
              <thead className="bg-indigo-600 dark:bg-indigo-500 text-white">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Site</th>
                  <th className="text-left p-4">Party</th>
                  <th className="text-left p-4">Opening Balance</th>
                  <th className="text-left p-4">Current Balance</th>
                  <th className="text-center p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr
                    key={acc.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-4 text-gray-900 dark:text-white">{acc.name}</td>
                    <td className="p-4 text-gray-900 dark:text-white capitalize">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          acc.type === 'bank'
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                            : acc.type === 'cash'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                            : 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                        }`}
                      >
                        {acc.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">
                      {acc.site?.name || '-'}
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">
                      {acc.party?.name || '-'}
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">
                      <span className="font-medium">
                        {acc.opening_balance?.toLocaleString() ?? '0'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">
                      <span className="font-medium">
                        {acc.current_balance?.toLocaleString() ?? '0'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              acc.is_locked ? 'bg-red-500 dark:bg-red-400' : 'bg-green-500 dark:bg-green-400'
                            }`}
                          ></span>
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {acc.is_locked ? 'Locked' : 'Active'}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
