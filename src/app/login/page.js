"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Jersey_10 } from "next/font/google"
import { PixelButton } from "@/components/PixelButton"

const jersey10 = Jersey_10({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const router = useRouter() 

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push("/explore") // or wherever your app goes after login
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

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <form onSubmit={handleLogin} className="flex flex-col items-center">
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">{error}</div>
          )}

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

          {/* Login Button */}
          <PixelButton
            src="/images/LOGINButton.png"
            alt="Login"
            width={200}
            height={70}
            onClick={handleLogin}
          />

          {/* Sign Up Link */}
          <div
            className={`mt-6 text-white text-2xl ${jersey10.className}`}
            style={{
              WebkitTextStroke: "0.5px black",
              textShadow: "1px 1px 0px #000",
            }}
          >
            Don&pos;t have an account?{" "}
            <a href="/register" className="underline hover:text-yellow-300">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
