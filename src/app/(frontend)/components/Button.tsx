import Link from 'next/link'
import { useEffect } from 'react'
import { useState } from 'react'


export function EditButton({ href }: { href: string }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    try {
      const user = userStr ? JSON.parse(userStr) : {}
      setIsAdmin(user?.role === 'admin'|| user?.role === 'manager')
    } catch (err) {
      console.error('Failed to parse user from localStorage', err)
    }
  }, [])

  if (!isAdmin) return null

  return (
    <Link href={href}>
      <button
        className="py-2 text-blue-600 hover:text-blue-700"
      >
        Edit
      </button>
    </Link>
  )
}



export function DeleteButton({ onClick }: { onClick: () => void }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    try {
      const user = userStr ? JSON.parse(userStr) : {}
      setIsAdmin(user?.role === 'admin')
    } catch (err) {
      console.error('Failed to parse user from localStorage', err)
    }
  }, [])

  if (!isAdmin) return null

  return (
    <div className="flex gap-2">
      {isAdmin && (
        <button 
          onClick={onClick} 
          className="px-4 p-2 text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      )}
    </div>
  )
}



export function ActionHeader() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    try {
      const user = userStr ? JSON.parse(userStr) : {}
      setIsAdmin(user?.role === 'admin'|| user?.role === 'manager')
    } catch (err) {
      console.error('Failed to parse user from localStorage', err)
    }
  }, [])

  if (!isAdmin) return null

  return (
    <th className="p-3 text-left">
     	Actions
    </th>
  )
}




export function CheckBox({ checked, handleSelect }: { checked: boolean, handleSelect: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    try {
      const user = userStr ? JSON.parse(userStr) : {}
      setIsAdmin(user?.role === 'admin')
    } catch (err) {
      console.error('Failed to parse user from localStorage', err)
    }
  }, [])

  if (!isAdmin) return null

  return (
    <div className="flex gap-2">
      {isAdmin && (
         <input
         type="checkbox"
         checked={checked}
         onChange={handleSelect}
         className="w-5 h-5"
       />
      )}
    </div>
  )
}




interface FloatButtonProps {
  selected: Set<string>;
  handleBulkDelete: () => void;
  link: string;
  title: string;
}

export function FloatButton({ selected, handleBulkDelete, link, title }: FloatButtonProps) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    try {
      const user = userStr ? JSON.parse(userStr) : {}
      setIsAdmin(user?.role === 'admin')
    } catch (err) {
      console.error('Failed to parse user from localStorage', err)
    }
  }, [])

  if (!isAdmin) return null

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end space-y-2">
    {isAdmin && selected.size > 0 && (
      <button
        onClick={handleBulkDelete}
        className="bg-red-600 text-white p-3  hover:bg-red-700 shadow-md"
        title={title}
      >
        🗑
      </button>
    )}
   
    <Link href={link}>
    <button className="bg-indigo-600 text-white p-3 px-4 shadow hover:bg-indigo-700">
        +
      </button>
    </Link>
  </div>
  )
}