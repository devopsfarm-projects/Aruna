// 'use client';

// import { useEffect, useState } from 'react';

// type VendorItem = {
//   id: string;
//   Mines_name: string;
//   address: string;
//   vendor: string;
//   GST: string;
//   vendor_no: string;
//   Company_no: string;
//   mail_id: string;
// };

// export default function VendorList() {
//   const [vendors, setVendors] = useState<VendorItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetching vendors from Payload API
//   useEffect(() => {
//     const fetchVendors = async () => {
//       const res = await fetch('/api/vendor'); // Adjust the API route if needed
//       const data = await res.json();
//       setVendors(data.docs || []);
//       setLoading(false);
//     };
//     fetchVendors();
//   }, []);

//   // Handle delete vendor
//   const handleDelete = async (id: string) => {
//     if (confirm('Are you sure you want to delete this vendor?')) {
//       const res = await fetch(`/api/vendors/${id}`, {
//         method: 'DELETE',
//       });
//       if (res.ok) {
//         setVendors(vendors.filter((vendor) => vendor.id !== id));
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Vendors List</h1>

//       {loading ? (
//         <p className="text-center">Loading vendors...</p>
//       ) : (
//         <div className="space-y-4">
//           {vendors.map((vendor) => (
//             <div
//               key={vendor.id}
//               className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col md:flex-row items-center justify-between"
//             >
//               <div className="mb-4 md:mb-0">
//                 <h3 className="text-xl font-medium text-gray-800">{vendor.Mines_name}</h3>
//                 <p className="text-gray-600">{vendor.vendor}</p>
//                 <p className="text-gray-600">{vendor.GST}</p>
//                 <p className="text-gray-600">{vendor.vendor_no}</p>
//                 <p className="text-gray-600">{vendor.Company_no}</p>
//                 <p className="text-gray-600">{vendor.mail_id}</p>
//                 <p className="text-gray-600">{vendor.address}</p>
//               </div>

//               <div className="flex space-x-4">
//                 <a
//                   href={`/vendor/edit/${vendor.id}`}
//                   className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
//                 >
//                   Edit
//                 </a>
//                 <button
//                   onClick={() => handleDelete(vendor.id)}
//                   className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





//mine/page.tsx
import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import MineClient from "./vendor";

const VenderServer = async () => {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({ collection: "vendor" });
  return <MineClient VendorItems={docs} />;
};

export default VenderServer;
