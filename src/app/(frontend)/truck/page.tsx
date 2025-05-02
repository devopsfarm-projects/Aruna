'use client';

import { useEffect, useState } from 'react';

type TruckItem = {
  id: string;
  driver_name: string;
  phone: string;
  truck_no: string;
  truck_cost: string;
};

export default function TruckList() {
  const [trucks, setTrucks] = useState<TruckItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrucks = async () => {
      const res = await fetch('/api/truck'); 
      const data = await res.json();
      setTrucks(data.docs || []);
      setLoading(false);
    };
    fetchTrucks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Truck List</h1>

      {loading ? (
        <p className="text-center">Loading trucks...</p>
      ) : (
        <div className="space-y-4">
          {trucks.map((truck) => (
            <div
              key={truck.id}
              className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col md:flex-row items-center justify-between"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-medium text-gray-800">{truck.driver_name}</h3>
                <p className="text-gray-600">Truck No: {truck.truck_no}</p>
                <p className="text-gray-600">Cost: {truck.truck_cost}</p>
              </div>
              <div className="flex space-x-4">
                <a
                  href={`tel:${truck.phone}`}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Call Driver
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
