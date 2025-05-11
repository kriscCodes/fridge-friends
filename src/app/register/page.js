"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Jersey_10 } from 'next/font/google'
import { PixelButton } from "@/components/PixelButton"

const jersey10 = Jersey_10({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Create user profile in the "profiles" table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        username,
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        setError(profileError.message)
        return
      }

      // Show success message
      setSuccess("Check your email to confirm your account.")
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/NYCBG.png" 
          alt="NYC Pixel Background" 
          fill 
          className="object-cover image-rendering-pixelated" 
          priority
          unoptimized={true}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div
            className={`text-4xl text-white ${jersey10.className}`}
            style={{
              WebkitTextStroke: "1px black",
              textShadow: "2px 2px 0px #000",
            }}
          >
            Loading...
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="relative z-10 w-full max-w-md px-4 text-center">
          <div
            className={`text-4xl text-white ${jersey10.className} mb-4`}
            style={{
              WebkitTextStroke: "1px black",
              textShadow: "2px 2px 0px #000",
            }}
          >
            {success}
          </div>
        </div>
      )}

      {/* Signup Form Container */}
      {!success && !isLoading && (
        <div className="relative z-10 w-full max-w-md px-4">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="w-full mb-6">
              <div
                className={`text-4xl text-white ${jersey10.className} mb-2`}
                style={{
                  WebkitTextStroke: "1px black",
                  textShadow: "2px 2px 0px #000",
                }}
              >
                Username :
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 border-4 border-black bg-white rounded-none appearance-none text-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>

            {/* Email Field */}
            <div className="w-full mb-6">
              <div
                className={`text-4xl text-white ${jersey10.className} mb-2`}
                style={{
                  WebkitTextStroke: "1px black",
                  textShadow: "2px 2px 0px #000",
                }}
              >
                Email :
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border-4 border-black bg-white rounded-none appearance-none text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>

            {/* Password Field */}
            <div className="w-full mb-8">
              <div
                className={`text-4xl text-white ${jersey10.className} mb-2`}
                style={{
                  WebkitTextStroke: "1px black",
                  textShadow: "2px 2px 0px #000",
                }}
              >
                Password :
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border-4 border-black bg-white rounded-none appearance-none text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  boxShadow: "4px 4px 0px rgba(0, 0, 0, 0.2)",
                }}
              />
            </div>

            {/* Sign Up Button */}
            <PixelButton 
              src="/images/SIGNUPButton.png" 
              alt="Sign Up" 
              width={250}  
              height={100}  
              type="submit"
              disabled={isLoading}
            />
          </form>
        </div>
      )}
    </div>
  )
}
