import { SummaryCard } from "./FormSection"

interface SummaryProps {
  title: string;
  totalBlockArea: string;
  totalBlockCost: string;
  remainingAmount: string;
}

export default function Summary({ title, totalBlockArea, totalBlockCost, remainingAmount }: SummaryProps) {
  return (
    <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-600 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center sm:text-left">
        <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-4 py-1 rounded-full inline-block">
          {title}
        </span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <SummaryCard title="Total Block Area (m³)" value={totalBlockArea} />
        <SummaryCard title="Total Block Cost (₹)" value={totalBlockCost} />
        <SummaryCard title="Remaining Amount (₹)" value={remainingAmount} />
      </div>
    </section>                          
  );
}