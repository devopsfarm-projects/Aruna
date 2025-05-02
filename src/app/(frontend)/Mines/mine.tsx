"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function Mines({ MineItems }: { MineItems: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    Mines_name: "",
    address: "",
    GST: "",
    phone: ["", ""],
    mail_id: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target;
    if (name === "phone" && typeof index === "number") {
      const updatedPhones = [...formData.phone];
      updatedPhones[index] = value;
      setFormData({ ...formData, phone: updatedPhones });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      Mines_name: formData.Mines_name,
      address: formData.address,
      GST: formData.GST,
      mail_id: formData.mail_id,
      phone: formData.phone.filter(num => num).map(number => ({ number })),
    };

    try {
      const res = await fetch("/api/Mines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Mine added successfully!");
      } else {
        console.error("Failed to add mine");
      }
    } catch (error) {
      console.error("Error adding mine:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this mine?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/mines/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Mine deleted successfully!");
      } else {
        console.error("Failed to delete mine");
      }
    } catch (error) {
      console.error("Error deleting mine:", error);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8">🪨 Mines Directory</h1>

      <div className="flex justify-between items-center mb-6">
        <button className="border px-4 py-2 rounded hover:bg-gray-200">Show Entries</button>
        <button className="border px-4 py-2 rounded hover:bg-gray-200">Search</button>
      </div>

      <div className="text-center mb-6">
        <Link href="/Mines/addmine">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            ➕ Add New Mine
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4">S.No.</th>
              <th className="py-3 px-4">Mine Name</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">GST No</th>
              <th className="py-3 px-4">Mobile 1</th>
              <th className="py-3 px-4">Mobile 2</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Edit</th>
              <th className="py-3 px-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {MineItems.map((item, index) => (
              <tr key={item.id || index} className="border-t">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{item.Mines_name}</td>
                <td className="py-2 px-4">{item.address}</td>
                <td className="py-2 px-4">{item.GST}</td>
                <td className="py-2 px-4">{item.phone?.[0]?.number ?? ""}</td>
                <td className="py-2 px-4">{item.phone?.[1]?.number ?? ""}</td>
                <td className="py-2 px-4">{item.mail_id}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => {
                      setFormData({
                        Mines_name: item.Mines_name,
                        address: item.address,
                        GST: item.GST,
                        mail_id: item.mail_id,
                        phone: item.phone?.map((p: { number: string }) => p.number) || ["", ""],
                      });
                      setEditId(item.id);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Pencil size={18} />
                  </button>
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
