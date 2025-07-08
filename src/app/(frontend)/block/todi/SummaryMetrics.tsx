'use client';

import React from 'react';

type SummaryMetricsProps = {
  todies: Array<{
    total_block_area?: string | number;
    total_block_cost?: string | number;
    total_todi_cost?: string | number;
    estimate_cost?: string | number;
    depreciation?: string | number;
  }>;
};

export function SummaryMetrics({ todies }: SummaryMetricsProps) {
  // Calculate totals
  const totals = todies.reduce(
    (acc, todi) => ({
      totalBlockArea: acc.totalBlockArea + (parseFloat(todi.total_block_area?.toString() || '0') || 0),
      totalBlockCost: acc.totalBlockCost + (parseFloat(todi.total_block_cost?.toString() || '0') || 0),
      totalEstimateCost: acc.totalEstimateCost + (parseFloat(todi.estimate_cost?.toString() || '0') || 0),
      totalDepreciation: acc.totalDepreciation + (parseFloat(todi.depreciation?.toString() || '0') || 0),
    }),
    {
      totalBlockArea: 0,
      totalBlockCost: 0,
      totalEstimateCost: 0,
      totalDepreciation: 0,
    }
  );

  // Calculate remaining amount
  const remainingAmount = totals.totalBlockCost - (totals.totalEstimateCost + totals.totalDepreciation);

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Summary Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Block Area */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Block Area (m³)</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totals.totalBlockArea.toFixed(2)}
          </p>
        </div>

        {/* Total Block Cost */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Block Cost (₹)</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{totals.totalBlockCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Remaining Amount */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Remaining Amount (₹)</h3>
          <p className={`text-2xl font-bold ${
            remainingAmount < 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            ₹{remainingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}
