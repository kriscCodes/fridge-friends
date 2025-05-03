'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null) // ✅ new state
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    const user = data.user
    if (!user) {
      setError('User signup failed. Please try again.')
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      username: username,
      created_at: new Date(),
    })

    if (profileError) {
      setError(profileError.message)
      return
    }

    // ✅ Show success message
    setSuccess('Registered successfully! Please check your email to confirm your account.')
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
        {success && <p className="text-green-600 text-sm">{success}</p>} {/* ✅ rendered here */}
      </form>
    </main>
  )
}
