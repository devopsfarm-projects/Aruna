import { useEffect, useState } from "react";
import axios from "axios";
import { ApiResponse } from "../types";

export interface Vendor {
  id: string | number;
  vendor: string;
  vendor_no: string;
  address: string;
  mail_id: string;
  Company_no: string;
  phone: Array<{
    number: string;
    type?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}


interface FetchVendorProps {
  todi: any;
  setTodi: (value: any) => void;
}

export default function FetchVendor({ todi, setTodi }: FetchVendorProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axios.get<ApiResponse<Vendor>>("/api/vendor");
        const data = res.data.docs;
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vendor</label>
      <select
        value={todi.vender_id?.id ?? ""}
        onChange={(e) => {
          const selectedId = e.target.value;
          const selectedVendor = vendors.find((v) => String(v.id) === selectedId);
          if (selectedVendor) {
            setTodi((prev: any) => ({ ...prev, vender_id: selectedVendor }));
          }
        }}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      >
        <option value="">Select vendor</option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>
            {vendor.vendor}
          </option>
        ))}
      </select>
    </div>
  );
}
