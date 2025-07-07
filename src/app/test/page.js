'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    try {
      setIsLoading(true);
      // Simulate an API call
      const result = await new Promise(resolve => 
        setTimeout(() => resolve({ success: true, time: new Date().toISOString() }), 2000)
      );
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Loading Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={handleFetch}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Simulate Loading'}
          </button>
        </div>
        
        <div className="space-y-2">
          <div>
            <Link href="/" className="text-blue-500 hover:underline">
              Go to Home
            </Link>
          </div>
          
          <div>
            <Link href="/test" className="text-blue-500 hover:underline">
              Reload This Page
            </Link>
          </div>
        </div>
      </div>
      
      {data && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Response Data:</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
