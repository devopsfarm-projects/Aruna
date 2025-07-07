"use client"
import { EditButton,DeleteButton } from './Button'

export function EditButtonForBlock({ href }: { href: string }) {

  return (
      <EditButton href={href} />
  )
}






import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Message } from './Message'

export function DeleteButtonForBlock({ id ,name}: { id: string ,name:string}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${name}?`)) return

    try {
      setLoading(true)
      const res = await fetch(`/api/${name}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to delete')
      }
      router.refresh()
    } catch (error) {
      console.error('Delete failed:', error)
      setErrorMessage('Failed to delete')
      setShowErrorMessage(true)
    } finally {
      setLoading(false)
    }
  }

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
const [showErrorMessage, setShowErrorMessage] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [errorMessage, setErrorMessage] = useState('')

if (showErrorMessage) {
  return (
    <Message 
      setShowMessage={setShowErrorMessage} 
      path={'/block/todi'} 
      type='error' 
      message={errorMessage}
    />
  )
}

if (showSuccessMessage) {
  return (
    <Message 
      setShowMessage={setShowSuccessMessage} 
      path={'/block/todi'} 
      type='success' 
      message='Todi has been deleted successfully.'
    />
  )
}

  return (
    <DeleteButton
      onClick={handleDelete}
    />
  )
}
