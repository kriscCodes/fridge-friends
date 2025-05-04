"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import UserBarterPost from "./UserBarterPost" // 👈 import the new component

export default function UserBarterPosts({ limit = 5 }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserPosts = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError("Not logged in")
        setLoading(false)
        return
      }

      const { data, error: postError } = await supabase
        .from("barter_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (postError) {
        setError(postError.message)
      } else {
        setPosts(data)
      }

      setLoading(false)
    }

    fetchUserPosts()
  }, [limit])

  if (loading)
    return (
      <p className="text-white text-xl font-bold" style={{ fontFamily: "monospace", textShadow: "2px 2px 0px #000" }}>
        Loading your barter posts...
      </p>
    )
  if (error)
    return (
      <p className="text-red-500 text-xl font-bold" style={{ fontFamily: "monospace", textShadow: "2px 2px 0px #000" }}>
        {error}
      </p>
    )
  if (posts.length === 0)
    return (
      <p className="text-white text-xl font-bold" style={{ fontFamily: "monospace", textShadow: "2px 2px 0px #000" }}>
        You haven&apos;t posted anything yet.
      </p>
    )

  return (
    <div className="mt-8 w-full max-w-4xl">
      <h2
        className="text-2xl font-bold mb-4 text-white uppercase"
        style={{ fontFamily: "monospace", textShadow: "2px 2px 0px #000" }}
      >
        My Listings:
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <UserBarterPost key={post.post_id} post={post} />
        ))}
      </div>
    </div>
  )
}
