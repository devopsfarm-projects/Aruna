"use client";
import React, { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  password: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    phone: "",
    role: "owner",
    password: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.docs || []);
      } catch (err) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      if (!res.ok) throw new Error("Failed to update user");

      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? editingUser : u))
      );
      setEditingUser(null);
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("Failed to add user");
      const createdUser = await res.json();

      setUsers((prev) => [...prev, createdUser]);
      setNewUser({ name: "", email: "", phone: "", role: "owner", password:'' });
    } catch (err) {
      alert("Failed to add user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Users Directory</h1>

      {/* Add User Form */}
      <div className="mb-6 bg-white p-6 rounded shadow-md max-w-md mx-auto">
  <h2 className="text-xl font-bold mb-4">Add New User</h2>
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        if (!res.ok) throw new Error("Failed to add user");
        const created = await res.json();
        setUsers((prev) => [...prev, created]);
        setNewUser({
          name: "",
          email: "",
          phone: "",
          role: "user",
          password: "",
        });
      } catch (err) {
        alert("Failed to create user");
      }
    }}
    className="space-y-4"
  >
    <input
      type="text"
      value={newUser.name}
      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      className="w-full border px-4 py-2 rounded"
      placeholder="Name"
      required
    />
    <input
      type="email"
      value={newUser.email}
      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      className="w-full border px-4 py-2 rounded"
      placeholder="Email"
      required
    />
    <input
      type="text"
      value={newUser.phone}
      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
      className="w-full border px-4 py-2 rounded"
      placeholder="Phone"
    />
    <input
      type="password"
      value={newUser.password}
      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      className="w-full border px-4 py-2 rounded"
      placeholder="Password"
      required
    />
    <select
      value={newUser.role}
      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
      className="w-full border px-4 py-2 rounded"
    >
      <option value="owner">Owner</option>
      <option value="client">Client</option>
      <option value="sites-visitor">Sites Visitor</option>
    </select>
    <button
      type="submit"
      className="w-full bg-green-600 text-white py-2 rounded"
    >
      Add User
    </button>
  </form>
</div>


      {/* User Table + Edit Logic */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Role</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone || "-"}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Edit Form */}
          {editingUser && (
            <div className="mt-6 bg-white p-6 rounded shadow-md max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Email"
                  required
                />
                <input
                  type="text"
                  value={editingUser.phone || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded"
                  placeholder="Phone"
                />
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded"
                >
                  <option value="owner">Owner</option>
                  <option value="client">Client</option>
                  <option value="sites-visitor">Sites Visitor</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

