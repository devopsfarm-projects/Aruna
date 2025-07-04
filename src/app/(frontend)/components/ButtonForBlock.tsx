"use client"
import { EditButton,DeleteButton } from './Button'

export function EditButtonForBlock({ href }: { href: string }) {

  return (
      <EditButton href={href} />
  )
}






import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
      alert('Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DeleteButton
      onClick={handleDelete}
    />
  )
}
