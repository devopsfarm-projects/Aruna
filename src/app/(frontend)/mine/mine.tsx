

//mine/mine.tsx
"use client";
import Link from "next/link";
import React, { useState } from "react";

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
      const res = await fetch("/api/mines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        const newMine = await res.json();
        alert("Mine added successfully!");
        // Optionally: refresh the page or update local state
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
        // Optionally: refresh or update local state
      } else {
        console.error("Failed to delete mine");
      }
    } catch (error) {
      console.error("Error deleting mine:", error);
    }
  };
  

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <h1 className="text-center text-2xl font-bold mb-6">Mines Directory</h1>

      <div className="flex justify-between mb-4">
        <button className="border border-black px-4 py-2">Show Entries</button>
        <button className="border border-black px-4 py-2">Search</button>
      </div>
    <Link href='/mine/addmine'>
      <div className="text-center mb-4">
        <button  className="border px-4 py-2">Add new Mine</button>
      </div>
      </Link>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-black text-center">
          <thead>
            <tr className="border-b border-black">
              <th>S.No.</th>
              <th>Mine Name</th>
              <th>Address</th>
              <th>GST no</th>
              <th>Mobile no1</th>
              <th>Mobile no 2</th>
              <th>Mail id</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
  {MineItems.map((item, index) => (
    <tr key={item.id || index} className="border-b border-black">
      <td>{index + 1}</td>
      <td>{item.Mines_name}</td>
      <td>{item.address}</td>
      <td>{item.GST}</td>
      <td>{item.phone?.[0]?.number ?? ""}</td>
      <td>{item.phone?.[1]?.number ?? ""}</td>
      <td>{item.mail_id}</td>
      <td>
  <button
    onClick={() => {
      setFormData({
        Mines_name: item.Mines_name,
        address: item.address,
        GST: item.GST,
        mail_id: item.mail_id,
        phone: item.phone?.map((p: { number: any; }) => p.number) || ["", ""],
      });
      setEditId(item.id);
      setShowForm(true);
    }}
    className="text-blue-400"
  >
    Edit
  </button>
</td>

      <td>
  <button
    onClick={() => handleDelete(item.id)}
    className="text-red-400"
  >
    Delete
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
