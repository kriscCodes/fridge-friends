"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import BarterPostModal from "@/components/BarterPost"
import Navbar from "@/components/Navbar"
import UserBarterPosts from "@/components/UserBarterPosts"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePost = async ({ title, description }) => {
    console.log("Creating post:", title, description)
  }
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    } else {
      router.push('/login') // Redirect after logout
    }
  }

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push("/login")
        return
      }

      setUser(user)

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error(error)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    getProfile()
  }, [router])

  if (loading)
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/Userprofilebg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
        }}
      >
        <p
          className="text-white text-2xl font-bold"
          style={{ fontFamily: "monospace", textShadow: "2px 2px 0px #000" }}
        >
          Loading profile...
        </p>
      </div>
    )

  return (
    <>
      <Navbar />
      <main
        className="flex flex-col items-center min-h-screen p-6"
        style={{
          backgroundImage: "url('/images/Userprofilebg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
        }}
      >
        <div className="w-full max-w-6xl">
          <div className="bg-white/80 backdrop-blur-sm border-4 border-black rounded-xl p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1
              className="text-4xl font-bold mb-4 text-center uppercase"
              style={{
                fontFamily: "monospace",
                color: "white",
                textShadow: "2px 2px 0px #000",
                letterSpacing: "2px",
              }}
            >
              {profile?.username || "Username"}
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full">
                <p className="font-bold" style={{ fontFamily: "monospace" }}>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="font-bold" style={{ fontFamily: "monospace" }}>
                  <strong>Joined:</strong> {new Date(profile?.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg border-4 border-black font-bold uppercase hover:bg-red-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ fontFamily: "monospace", letterSpacing: "1px" }}
                >
                  Create Barter Post
                </button>

                <button
                  onClick={() => router.push("/requests")}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg border-4 border-black font-bold uppercase hover:bg-green-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ fontFamily: "monospace", letterSpacing: "1px" }}
                >
                  Your Offers
                </button>
              </div>
            </div>
          </div>

          <div className="bg-transparent">
            <UserBarterPosts />
          </div>

          <div className="flex justify-center mt-8">
            <button onClick={() => handleSignOut()}
              className="bg-red-600 text-white px-8 py-3 rounded-lg border-4 border-black font-bold uppercase hover:bg-red-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              style={{ fontFamily: "monospace", letterSpacing: "1px" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

      <BarterPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
