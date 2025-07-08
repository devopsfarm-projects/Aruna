"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Message } from './Message'

export function EditButtonForBlock({ href }: { href: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem('user')
        const user = userStr ? JSON.parse(userStr) : {}
        setUserRole(user?.role || null)
      } catch (err) {
        console.error('Error parsing user data:', err)
        setUserRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
    const timer = setTimeout(checkAuth, 300)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  // For debugging - show loading state
  if (isLoading) {
    console.log('EditButtonForBlock - Loading user role...')
    return null
  }

  if (isLoading) {
    return null;
  }
  
  // Hide edit button for 'user' role
  if (userRole === 'user') {
    return null;
  }

  return (
    <Link 
      href={href}
      className="text-blue-600 hover:underline mr-2"
    >
      Edit
    </Link>
  )
}

export function DeleteButtonForBlock({ id, name }: { id: string, name: string }) {
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      setUserRole(user?.role || null);
    } catch (error) {
      console.error('Error getting user role:', error);
      setUserRole(null);
    }
  }, []);

  // Only show delete button for admin
  if (userRole !== 'admin') {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${name}?`)) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/${name}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete');
      }
      router.refresh();
    } catch (error) {
      console.error('Delete failed:', error);
      setErrorMessage('Failed to delete');
      setShowErrorMessage(true);
    } finally {
      setLoading(false);
    }
  };

  if (showErrorMessage) {
    return (
      <Message 
        setShowMessage={setShowErrorMessage} 
        path={'/block/todi'} 
        type='error' 
        message={errorMessage}
      />
    );
  }

  if (showSuccessMessage) {
    return (
      <Message 
        setShowMessage={setShowSuccessMessage} 
        path={'/block/todi'} 
        type='success' 
        message='Todi has been deleted successfully.'
      />
    );
  }

  return (
    <button 
      onClick={handleDelete}
      className="text-red-600 hover:underline ml-2"
      disabled={loading}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
