'use client';

import { useEffect, useState } from 'react';

type Party = {
  id: string;
  name: string;
  category?: 'block_supplier' | 'labour_contractor' | 'other';
  contact_person?: string;
  phone?: string;
  pan_number?: string;
  gst?: string;
  address?: string;
};

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await fetch('/api/parties'); // Make sure this route is correct and exposed by Payload
        const data = await res.json();
        setParties(data.docs || []);
      } catch (err) {
        setError('Failed to load parties');
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Parties</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {parties.map((party) => (
            <div key={party.id} className="bg-white p-5 rounded-xl shadow border border-gray-200">
              <h2 className="text-xl font-semibold mb-1">{party.name}</h2>
              <p className="text-sm text-gray-500 mb-2 capitalize">{party.category?.replace('_', ' ')}</p>

              <div className="space-y-1 text-sm text-gray-700">
                {party.contact_person && <p><strong>Contact:</strong> {party.contact_person}</p>}
                {party.phone && <p><strong>Phone:</strong> {party.phone}</p>}
                {party.pan_number && <p><strong>PAN:</strong> {party.pan_number}</p>}
                {party.address && <p><strong>Address:</strong> {party.address}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
