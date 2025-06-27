export const FormInput = ({ label, id, name, value, onChange, disabled = false }: any) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border p-2 rounded-md dark:bg-gray-700 dark:text-white ${
          disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
};

export const FormSelect = ({ label, id, name, value, onChange, children }: any) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border p-2 rounded-md dark:bg-gray-700 dark:text-white"
      >
        {children}
      </select>
    </div>
  );
};

export const FormDisplay = ({ label, value }: { label: string; value: any }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="w-full border p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        {Number(value)?.toLocaleString('en-IN') || '0'}
      </div>
    </div>
  );
};

export const SummaryCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
};