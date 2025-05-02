'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // stored as user_metadata
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      alert('Registered successfully!')
      router.push('/login') // or /dashboard
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="Username"
          value={username}
          className="p-2 border border-gray-300 rounded"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="p-2 border border-gray-300 rounded"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="p-2 border border-gray-300 rounded"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Sign Up
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </main>
  )
}
