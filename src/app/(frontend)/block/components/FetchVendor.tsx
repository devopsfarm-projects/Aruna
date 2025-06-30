import { useEffect, useState } from "react";
import axios from "axios";
import { Vendor } from "../types";   
   export default function FetchVendor({ todi, handleInput, setTodi }: any) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [vendors, setVendors] = useState<Vendor[]>([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true)
            setError(null)
            const [vendorsRes] = await Promise.all([axios.get<{ docs: Vendor[] }>('/api/vendor')])
            setVendors(vendorsRes.data.docs || [])
          } catch (error) {
            setError('Failed to load data. Please try again later.')
            console.error('Error fetching data:', error)
          } finally {
            setIsLoading(false)
          }
        }
    
        fetchData()
      }, [setVendors, setIsLoading, setError])

   return(
 
 <>
 <div   className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vendor</label>
    <select
      value={todi.vender_id}
      onChange={(e) => {
        const value = Number(e.target.value);
        handleInput({ ...e, target: { ...e.target, name: 'vender_id', value } }, setTodi);
      }}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      required
    >
      <option value="">Select vendor</option>
      {vendors.map((vendor) => (
        <option key={vendor.id} value={vendor.id}>
          {vendor.vendor}
        </option>
      ))}
    </select>
    </div>
    </>
   )
}