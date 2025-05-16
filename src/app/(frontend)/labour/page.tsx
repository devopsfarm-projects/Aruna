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
  const [newLabour, setNewLabour] = useState({ name: '', mobile: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', mobile: '' });

  useEffect(() => {
    fetchLabour();
  }, []);

  const fetchLabour = async () => {
    const res = await fetch('/api/labour');
    const data = await res.json();
    setLabour(data.docs || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newLabour.name || !newLabour.mobile) return alert('Please fill all fields');
    const res = await fetch('/api/labour', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLabour),
    });
    if (!res.ok) return alert('Failed to add labour');
    setNewLabour({ name: '', mobile: '' });
    fetchLabour();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this labour?')) return;
    const res = await fetch(`/api/labour/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) return alert('Failed to delete labour');
    fetchLabour();
  };

  const handleEdit = (item: LabourItem) => {
    setEditingId(item.id);
    setEditData({ name: item.name, mobile: item.mobile });
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/labour/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    if (!res.ok) return alert('Failed to update labour');
    setEditingId(null);
    fetchLabour();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          <span className="text-indigo-600 dark:text-indigo-400">Labour</span> Directory
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 dark:border-indigo-400 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading labour records...</p>
          </div>
        ) : (
          <>
            {/* Add New Labour */}
            <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter labour name"
                  value={newLabour.name}
                  onChange={(e) => setNewLabour({ ...newLabour, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">+</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter mobile number"
                    value={newLabour.mobile}
                    onChange={(e) => setNewLabour({ ...newLabour, mobile: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <button
                onClick={handleAdd}
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200"
              >
                <span className="font-medium">Add New Labour</span>
              </button>
            </div>

            <div className="space-y-6">
              {labour.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                >
                  {editingId === item.id ? (
                    <>
                      <div className="flex gap-4 items-center flex-1">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 dark:text-gray-400">+</span>
                            </div>
                            <input
                              type="text"
                              value={editData.mobile}
                              onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200"
                        >
                          <span className="font-medium">Save</span>
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-600 dark:bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
                        >
                          <span className="font-medium">Cancel</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.mobile}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={`tel:${item.mobile}`}
                          className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
                        >
                          <span className="font-medium">Call</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-500 dark:bg-yellow-400 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all duration-200 flex items-center gap-2"
                        >
                          <span className="font-medium">Edit</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
                        >
                          <span className="font-medium">Delete</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
