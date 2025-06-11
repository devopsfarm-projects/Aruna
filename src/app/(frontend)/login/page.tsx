'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if dark mode is preferred by the user
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(prefersDark)

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
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred.')
      setIsLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900 rounded-2xl p-8 w-full max-w-md animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Image src="/image.png" alt="Payload Logo" width={100} height={100} className="" />
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isDarkMode ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 1.536l-.105-.105A5.5 5.5 0 0018 10.5M6.863 6.863l-1.435-1.435A5.5 5.5 0 003 10.5v1M6.863 6.863l1.435-1.435A5.5 5.5 0 0110.5 3v1M10.5 16.172l-1.435 1.435A5.5 5.5 0 013 13.5v-1m17.5 2.172l1.435-1.435A5.5 5.5 0 0013.5 21v-1M13.5 3.863l1.435 1.435A5.5 5.5 0 0121 10.5v1"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              )}
            </svg>
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          />

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-white font-semibold p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                Loading...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
