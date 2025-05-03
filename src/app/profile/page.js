'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import BarterPostModal from '@/components/BarterPost'
import Navbar from '@/components/Navbar'
import UserBarterPosts from '@/components/UserBarterPosts'


export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePost = async ({ title, description }) => {

console.log('Creating post:', title, description)}

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    getProfile()
  }, [router])



  
  
  if (loading) return <p className="text-center mt-8">Loading profile...</p>

  return (
    <>
    <Navbar/>
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div>
        <p><strong>Username:</strong> {profile?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Joined:</strong> {new Date(profile?.created_at).toLocaleDateString()}</p>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Barter Post
      </button>

      <BarterPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}

        />
    <UserBarterPosts/>

    </main>
    </>
  )
}
