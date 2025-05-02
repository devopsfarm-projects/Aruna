'use client';

import { useEffect, useState } from 'react';

type LabourItem = {
  id: string;
  name: string;
  mobile: string;
};

export default function LabourList() {
  const [labour, setLabour] = useState<LabourItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabour = async () => {
      const res = await fetch('/api/labour'); // Adjust route if using custom API
      const data = await res.json();
      setLabour(data.docs || []);
      setLoading(false);
    };
    fetchLabour();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Labour List</h1>

      {loading ? (
        <p className="text-center">Loading labours...</p>
      ) : (
        <div className="space-y-4">
          {labour.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-medium text-gray-800">{item.name}</h3>
                <p className="text-gray-600">{item.mobile}</p>
              </div>
              <a
                href={`tel:${item.mobile}`}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Call
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
