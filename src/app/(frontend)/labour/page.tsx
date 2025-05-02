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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Labour List</h1>

      {/* Add New Labour */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md flex gap-4">
        <input
          type="text"
          placeholder="Name"
          value={newLabour.name}
          onChange={(e) => setNewLabour({ ...newLabour, name: e.target.value })}
          className="border px-3 py-2 rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Mobile"
          value={newLabour.mobile}
          onChange={(e) => setNewLabour({ ...newLabour, mobile: e.target.value })}
          className="border px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading labours...</p>
      ) : (
        <div className="space-y-4">
          {labour.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex items-center justify-between"
            >
              {editingId === item.id ? (
                <>
                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="border px-2 py-1 rounded"
                    />
                    <input
                      type="text"
                      value={editData.mobile}
                      onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                      className="border px-2 py-1 rounded"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(item.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-medium text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">{item.mobile}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${item.mobile}`}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    >
                      Call
                    </a>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
