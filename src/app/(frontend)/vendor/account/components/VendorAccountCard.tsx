"use client";

import { useState } from 'react';

interface VendorAccountCardProps {
  id: string;
  todi?: {
    id?: number;
    BlockType?: string;
    date?: string;
    vender_id?: {
      id?: number;
      address?: string;
      vendor?: string;
      vendor_no?: string;
      updatedAt?: string;
      createdAt?: string;
    };
    munim?: string;
    l?: number;
    b?: number;
    h?: number;
    todi_cost?: number;
    hydra_cost?: number;
    truck_cost?: number;
    total_todi_area?: number;
    total_todi_cost?: number;
    estimate_cost?: number;
    depreciation?: number;
    final_cost?: number;
    group?: Array<{
      id?: string;
      date?: string;
      g_hydra_cost?: number;
      g_truck_cost?: number;
      total_block_area?: number | null;
      total_block_cost?: number | null;
      remaining_amount?: number | null;
      block?: Array<{
        id?: string;
        addmeasures?: Array<{
          id?: string;
          l?: number | null;
          b?: number | null;
          h?: number | null;
          block_area?: number;
          block_cost?: number;
        }>;
      }>;
    }>;
  };
  received_amount?: Array<{
    id?: string;
    amount?: number;
    date?: string;
    description?: string;
  }>;
  updatedAt?: string;
  createdAt?: string;
}

export default function VendorAccountCard({
  id,
  todi,
  received_amount,
  updatedAt,
  createdAt,
}: VendorAccountCardProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAddAmount = async () => {
    try {
      const amountValue = parseFloat(amount);
      if (!isNaN(amountValue) && amountValue > 0) {
        await fetch(`/api/vendor-account/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountValue,
            description,
          }),
        });
        // Reset form
        setAmount('');
        setDescription('');
        // Refresh the page to show updated data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error adding amount:', error);
    }
  };

  const receivedTotal = received_amount.reduce((sum, amt) => sum + amt.amount, 0);
  const remainingAmount = todi.final_cost - receivedTotal;

  return (
    <div className="p-4 border rounded py-24 shadow-sm bg-white dark:bg-gray-900">
      <h2 className="font-semibold text-lg mb-4 dark:text-white">
        Block Type: {todi?.BlockType ?? 'N/A'}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <p className="text-black dark:text-white">Vendor ID: {todi?.vender_id?.id ?? 'N/A'}</p>
        <p className="text-black dark:text-white">Vendor Name: {todi?.vender_id?.vendor ?? 'N/A'}</p>
        <p className="text-black dark:text-white">Vendor Contact: {todi?.vender_id?.vendor_no ?? 'N/A'}</p>
        <p className="text-black dark:text-white">Vendor Address: {todi?.vender_id?.address ?? 'N/A'}</p>
        <p className="text-black dark:text-white">Todi Cost: ₹{todi?.todi_cost}</p>
        <p className="text-black dark:text-white">Hydra Cost: ₹{todi?.hydra_cost}</p>
        <p className="text-black dark:text-white">Truck Cost: ₹{todi?.truck_cost}</p>
        <p className="text-black dark:text-white">Total Todi Area: {todi?.total_todi_area} sq ft</p>
        <p className="text-black dark:text-white">Total Todi Cost: ₹{todi?.total_todi_cost}</p>
        <p className="text-black dark:text-white">Estimate Cost: ₹{todi?.estimate_cost}</p>
        <p className="text-black dark:text-white">Depreciation: {todi?.depreciation}%</p>
        <p className="text-black dark:text-white">Final Cost: ₹{todi?.final_cost}</p>
        <p className="text-black dark:text-white">Received Total: ₹{receivedTotal}</p>
        <p className="text-black dark:text-white">Remaining Amount: ₹{remainingAmount}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2 dark:text-white">Add Received Amount</h3>
        <div className="flex gap-2 dark:bg-gray-900">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-2 py-1 dark:bg-gray-900"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-2 py-1 dark:bg-gray-900"
          />
          <button
            type="button"
            onClick={handleAddAmount}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Transaction History</h3>
        <div className="space-y-2">
          {received_amount.map((transaction) => (
            <div key={transaction.id} className="p-2 border rounded bg-gray-900 dark:bg-gray-900">
              <p>Amount: ₹{transaction.amount}</p>
              <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
              <p>Description: {transaction.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Block Details</h3>
        {todi.group.map((group) => (
          <div key={group.id} className="space-y-2 dark:bg-gray-900">
            <div className="p-2 border rounded bg-gray-900">
              <p>Group Date: {new Date(group.date).toLocaleDateString()}</p>
              <p>G Hydra Cost: ₹{group.g_hydra_cost}</p>
              <p>G Truck Cost: ₹{group.g_truck_cost}</p>
              <p>Total Block Area: {group.total_block_area ?? 'N/A'} sq ft</p>
              <p>Total Block Cost: ₹{group.total_block_cost ?? 'N/A'}</p>
              <p>Remaining Amount: ₹{group.remaining_amount ?? 'N/A'}</p>
            </div>
            {group.block.map((block) => (
              <div key={block.id} className="ml-4">
                {block.addmeasures.map((measure) => (
                  <div key={measure.id} className="p-2 border rounded bg-gray-900">
                    <p>Block Area: {measure.block_area} sq ft</p>
                    <p>Block Cost: ₹{measure.block_cost}</p>
                    <p>L: {measure.l ?? 'N/A'}</p>
                    <p>B: {measure.b ?? 'N/A'}</p>
                    <p>H: {measure.h ?? 'N/A'}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Timestamps</h3>
        <p>Created At: {new Date(createdAt).toLocaleString()}</p>
        <p>Updated At: {new Date(updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
