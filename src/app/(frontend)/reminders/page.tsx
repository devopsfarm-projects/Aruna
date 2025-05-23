'use client';

import { useEffect, useState } from 'react';

type Reminder = {
  id: string;
  message: string;
  due_date: string;
  user?: {
    id: string;
    email: string;
  };
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch('/api/reminders'); // Ensure this API route works
        const data = await res.json();
        setReminders(data.docs || []);
      } catch (err: unknown) {
        setError(`Failed to load reminders: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Reminders</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="bg-white rounded-xl shadow p-5 border border-gray-200">
              <h2 className="text-lg font-semibold mb-2">{reminder.message}</h2>
              <p className="text-sm text-gray-500 mb-1">
                <strong>Due:</strong>{' '}
                {new Date(reminder.due_date).toLocaleDateString()}
              </p>
              {reminder.user && (
                <p className="text-sm text-gray-500">
                  <strong>User:</strong> {reminder.user.email}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
