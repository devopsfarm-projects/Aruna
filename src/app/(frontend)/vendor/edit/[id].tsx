'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type VendorItem = {
  id: string;
  Mines_name: string;
  address: string;
  vendor: string;
  GST: string;
  vendor_no: string;
  Company_no: string;
  mail_id: string;
};

export default function EditVendor() {
  const [vendor, setVendor] = useState<VendorItem | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchVendor = async () => {
        const res = await fetch(`/api/vendor/${id}`);
        const data = await res.json();
        setVendor(data);
        setLoading(false);
      };
      fetchVendor();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (vendor) {
      setVendor({
        ...vendor,
        [e.target.name]: e.target.value,
      });
    }
  };
  

  const handleSave = async () => {
    if (vendor) {
      const res = await fetch(`/api/vendor/${vendor.id}`, {
        method: 'PUT',
        body: JSON.stringify(vendor),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        router.push('/vendor');
      }
    }
  };

  if (loading) return <p>Loading vendor...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Edit Vendor</h1>

      {vendor && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700">Mines Name</label>
              <input
                type="text"
                name="Mines_name"
                value={vendor.Mines_name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Vendor Name</label>
              <input
                type="text"
                name="vendor"
                value={vendor.vendor}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">GST No.</label>
              <input
                type="text"
                name="GST"
                value={vendor.GST}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Vendor Mobile No.</label>
              <input
                type="text"
                name="vendor_no"
                value={vendor.vendor_no}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Company Mobile No.</label>
              <input
                type="text"
                name="Company_no"
                value={vendor.Company_no}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="mail_id"
                value={vendor.mail_id}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-2"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={vendor.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-2"
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-4"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
