import { useState, useEffect } from 'react';
import { headers as getHeaders } from 'next/headers.js';
import { getPayload } from 'payload';
import config from '@/payload.config';

interface User {
  email: string;
  [key: string]: any;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const headers = await getHeaders();
      const payloadConfig = await config;
      const payload = await getPayload({ config: payloadConfig });
      const { user: fetchedUser } = await payload.auth({ headers });
      setUser(fetchedUser as User);
    };

    fetchUser();
  }, []);

  return { user };
}
