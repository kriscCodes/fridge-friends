"use client"
import { useState } from "react"
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
    
      const { data, error: storageError } = await supabase.storage
        .from("barter-images")
        .upload(fileName, imageFile, {
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
      <div className="relative w-full max-w-4xl rounded-xl overflow-hidden"> {/* wider modal */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `url('/images/BarteringBG.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  ></div>
  <div className="relative z-10 p-8">
    <h2
      className="text-4xl font-bold mb-8 text-center text-white"
      style={{ textShadow: "2px 2px 0 #000" }}
    >
      Trading
    </h2>

    {/* 🔥 FLEX CONTAINER: split left/right */}
    <div className="flex flex-row gap-8">
      {/* LEFT: FORM */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
        {/* name, type, description, deadline */}
        {/* ...keep form inputs the same... */}
        <div>
          <label className="block text-xl font-bold mb-2 text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            Name :
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg border-4 border-gray-300 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-xl font-bold mb-2 text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            Type :
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 rounded-lg border-4 border-gray-300 bg-white"
            required
          >
            <option value="" disabled>Select type</option>
            <option value="item">Item</option>
            <option value="service">Service</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xl font-bold mb-2 text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            Description :
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg border-4 border-gray-300 bg-white"
            rows="3"
            required
          />
        </div>
        <div>
          <label className="block text-xl font-bold mb-2 text-white" style={{ textShadow: "2px 2px 0 #000" }}>
            Exp. Date :
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-3 rounded-lg border-4 border-gray-300 bg-white"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm bg-white p-2 rounded">{error}</p>}
        {success && <p className="text-green-600 text-sm bg-white p-2 rounded">{success}</p>}

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button type="submit" className="px-6 py-3 bg-green-500 text-white font-bold rounded text-xl uppercase hover:bg-green-600" style={{ textShadow: "1px 1px 0 #000" }}>
            UPLOAD
          </button>
        </div>
      </form>

      {/* RIGHT: IMAGE UPLOAD */}
      <div className="flex-shrink-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-white border-4 border-gray-300 relative overflow-hidden rounded-lg">
          {imageFile ? (
            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold">
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
