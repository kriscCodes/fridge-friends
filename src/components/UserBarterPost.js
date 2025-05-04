"use client"
import { Jersey_10 } from "next/font/google"
import { useState, useEffect } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

const jersey10 = Jersey_10({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

export default function UserBarterPost({ post }) {
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    if (post.image_url) {
      const { data } = supabase.storage.from("barter-images").getPublicUrl(post.image_url)

      setImageUrl(data.publicUrl)
    }
  }, [post.image_url])

  return (
    <div
      className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-2"
      style={{ imageRendering: "pixelated" }}
    >
      {imageUrl && (
        <div className="relative w-full h-40 overflow-hidden rounded-lg border-4 border-black">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={post.name}
            fill
            className="object-cover"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      )}

      <div>
        <div
          className={`text-2xl text-black ${jersey10.className} mb-1 uppercase`}
          style={{ textShadow: "2px 2px 0px #000" }}
        >
          {post.name}
        </div>
        <p className="text-sm text-gray-700 line-clamp-2 font-bold" style={{ fontFamily: "monospace" }}>
          {post.description}
        </p>
      </div>

      <div className="text-sm text-gray-700 mt-1 font-bold" style={{ fontFamily: "monospace" }}>
        <p>
          <strong>Type:</strong> {post.type}
        </p>
        <p>
          <strong>Barter:</strong> {post.barter_type}
        </p>
        <p>
          <strong>Deadline:</strong> {new Date(post.deadline).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
