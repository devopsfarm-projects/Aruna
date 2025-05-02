'use client';

import { useEffect, useState } from 'react';

type MediaItem = {
  id: string;
  alt: string;
  filename: string;
  url: string;
};

export default function MediaGallery() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      const res = await fetch('/api/media'); // Adjust route if using custom API
      const data = await res.json();
      setMedia(data.docs || []);
      setLoading(false);
    };
    fetchMedia();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Media Gallery</h1>

      {loading ? (
        <p className="text-center">Loading media...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
            >
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm font-medium text-gray-700">{item.alt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
