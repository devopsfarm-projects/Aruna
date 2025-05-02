'use client';

import React, { useEffect, useState } from 'react';

type Site = {
  id: string;
  site_name: string;
  location?: string;
  is_closed?: boolean;
  start_date?: string;
  end_date?: string;
};

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await fetch('/api/sites'); // Adjust this API path as needed
        if (!res.ok) throw new Error('Failed to fetch sites');
        const data = await res.json();
        setSites(data.docs || []);
      } catch (err) {
        setError('Unable to load site data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Sites</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <div key={site.id} className="bg-white shadow rounded-lg p-5 border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">{site.site_name}</h2>
              <p className="text-gray-600 mb-1">
                <strong>Location:</strong> {site.location || 'N/A'}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Start:</strong> {site.start_date ? new Date(site.start_date).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>End:</strong> {site.end_date ? new Date(site.end_date).toLocaleDateString() : 'N/A'}
              </p>
              <p className="mt-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    site.is_closed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {site.is_closed ? 'Closed' : 'Active'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
