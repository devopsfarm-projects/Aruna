"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function Vendor({ VendorItems }: { VendorItems: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    Mines_name: '',
    address: '',
    vendor: '',
    GST: '',
    vendor_no: '',
    Company_no: '',
    mail_id: '',
    phone: ["", ""]
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
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
      const res = await fetch("/api/Vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Vendor added successfully!");
      } else {
        console.error("Failed to add Vendor");
      }
    } catch (error) {
      console.error("Error adding Vendor:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this Vendor?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/Vendor/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Vendor deleted successfully!");
      } else {
        console.error("Failed to delete Vendor");
      }
    } catch (error) {
      console.error("Error deleting Vendor:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Vendor Directory</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-200 transition">Show Entries</button>
        <button className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-200 transition">Search</button>
        <Link href="/vendor/addvendor">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Add New Vendor
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">S.No.</th>
              <th className="p-3 text-left">Mine Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">GST No</th>
              <th className="p-3">Mobile 1</th>
              <th className="p-3">Mobile 2</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3">Edit</th>
              <th className="p-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {VendorItems.map((item, index) => (
              <tr key={item.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3">{item.Mines_name}</td>
                <td className="p-3">{item.address}</td>
                <td className="p-3">{item.GST}</td>
                <td className="p-3 text-center">{item.phone?.[0]?.number ?? "-"}</td>
                <td className="p-3 text-center">{item.phone?.[1]?.number ?? "-"}</td>
                <td className="p-3">{item.mail_id}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setFormData({
                        Mines_name: item.Mines_name,
                        address: item.address,
                        GST: item.GST,
                        mail_id: item.mail_id,
                        phone: item.phone?.map((p: { number: string }) => p.number) || ["", ""],
                        vendor: item.vendor || '',
                        vendor_no: item.vendor_no || '',
                        Company_no: item.Company_no || '',
                      });
                      setEditId(item.id);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
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
