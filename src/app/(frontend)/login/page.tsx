'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const email = `${username}@jodhpurmines.com`

  useEffect(() => {
    // Check if dark mode is preferred by the user
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    // Listen for changes in system preference
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => setIsDarkMode(e.matches))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        setError(data.message || 'Login failed.')
      }
      setIsLoading(false)
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred.')
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="bg-cover bg-center bg-fixed" style={{backgroundImage: 'url("https://g.foolcdn.com/editorial/images/439207/gold-mine-in-australia.jpg")'}}>
    <div className="h-screen flex justify-center items-center">
        <div className="bg-white dark:bg-gray-800 mx-4 p-8 rounded shadow-md w-full md:w-1/2 lg:w-1/3">
            <div className="flex justify-center mb-6">
    <img src="/png.png" alt="Payload Logo" className="w-32 sm:w-32" />
</div>
            
            <form>
                <div className="mb-4">
                    <label className="block font-semibold text-gray-700 mb-2 dark:text-gray-300">
                        Username
                    </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border rounded w-full py-2 px-3 text-gray-700 dark:text-black leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="Enter your username" />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold text-gray-700 mb-2 dark:text-gray-300" htmlFor="password">
                        Password
                    </label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded w-full py-2 px-3 text-gray-700 dark:text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="Default password: 123456" />
                    
                </div>
                <div className="mb-6">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button">
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
  )
}
function setIsDarkMode(matches: boolean): any {
  throw new Error('Function not implemented.')
}

