"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function BarterPostModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("")
  const [deadline, setDeadline] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const router = useRouter()
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  // Get location when modal opens
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude)
          setLongitude(pos.coords.longitude)
        },
        (err) => {
          console.error("Location error:", err)
        },
      )
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError("You must be logged in to post.")
      return
    }

    let imageFileName = null

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${self.crypto?.randomUUID?.() || Date.now()}.${fileExt}`

      console.log("Uploading image:", fileName, imageFile)

      const { data, error: storageError } = await supabase.storage.from("barter-images").upload(fileName, imageFile, {
        upsert: true,
      })

      if (storageError) {
        console.error("Upload failed:", storageError)
        setError("Image upload failed: " + storageError.message)
        return
      }

      console.log("Upload success:", data)
      imageFileName = fileName
    }

    const { error: insertError } = await supabase.from("barter_posts").insert({
      user_id: user.id,
      name: title,
      description,
      type,
      deadline,
      barter_type: "direct",
      image_url: imageFileName, // store filename only
      latitude,
      longitude,
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess("Post created successfully!")
      setTimeout(() => {
        router.refresh()
        onClose()
      }, 300)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden"
        style={{
          imageRendering: "pixelated",
          border: "8px solid #000",
          borderRadius: "16px",
          boxShadow: "0 0 0 4px #fff, 0 0 0 8px #000, 0 10px 15px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/images/Bartering.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            imageRendering: "pixelated",
          }}
        ></div>
        <div className="relative z-10 p-8">
          <h2
            className="text-4xl font-bold mb-8 text-center text-white uppercase"
            style={{
              textShadow: "3px 3px 0 #000",
              fontFamily: "monospace",
              letterSpacing: "2px",
            }}
          >
            Trading
          </h2>

          {/* 🔥 FLEX CONTAINER: split left/right */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* LEFT: FORM */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-6">
              {/* name, type, description, deadline */}
              <div>
                <label
                  className="block text-xl font-bold mb-2 text-white"
                  style={{
                    textShadow: "2px 2px 0 #000",
                    fontFamily: "monospace",
                  }}
                >
                  Name :
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-lg border-4 border-black bg-white"
                  required
                  style={{ fontFamily: "monospace" }}
                />
              </div>
              <div>
                <label
                  className="block text-xl font-bold mb-2 text-white"
                  style={{
                    textShadow: "2px 2px 0 #000",
                    fontFamily: "monospace",
                  }}
                >
                  Type :
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 rounded-lg border-4 border-black bg-white"
                  required
                  style={{ fontFamily: "monospace" }}
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  <option value="item">Item</option>
                  <option value="service">Service</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-xl font-bold mb-2 text-white"
                  style={{
                    textShadow: "2px 2px 0 #000",
                    fontFamily: "monospace",
                  }}
                >
                  Description :
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-lg border-4 border-black bg-white"
                  rows="3"
                  required
                  style={{ fontFamily: "monospace" }}
                />
              </div>
              <div>
                <label
                  className="block text-xl font-bold mb-2 text-white"
                  style={{
                    textShadow: "2px 2px 0 #000",
                    fontFamily: "monospace",
                  }}
                >
                  Exp. Date :
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-3 rounded-lg border-4 border-black bg-white"
                  required
                  style={{ fontFamily: "monospace" }}
                />
              </div>

              {error && (
                <p
                  className="text-red-600 text-sm bg-white p-2 rounded border-2 border-black"
                  style={{ fontFamily: "monospace" }}
                >
                  {error}
                </p>
              )}
              {success && (
                <p
                  className="text-green-600 text-sm bg-white p-2 rounded border-2 border-black"
                  style={{ fontFamily: "monospace" }}
                >
                  {success}
                </p>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg border-4 border-black font-bold hover:bg-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ fontFamily: "monospace" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg border-4 border-black text-xl uppercase hover:bg-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{
                    textShadow: "1px 1px 0 #000",
                    fontFamily: "monospace",
                    letterSpacing: "1px",
                  }}
                >
                  UPLOAD
                </button>
              </div>
            </form>

            {/* RIGHT: IMAGE UPLOAD */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-white border-4 border-black relative overflow-hidden rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <span
                    className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold"
                    style={{ fontFamily: "monospace" }}
                  >
                    Upload
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
