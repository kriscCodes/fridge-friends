'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function BarterPostModal({ isOpen, onClose}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [deadline, setDeadline] = useState('')
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
      setError('You must be logged in to post.')
      return
    }
  
    const { error: insertError } = await supabase.from('barter_posts').insert({
      user_id: user.id,
      name: title,
      description,
      type,
      deadline,
      barter_type: 'direct',
    })
  
    if (insertError) {
        setError(insertError.message)
      } else {
        setSuccess('Post created successfully!')
      
        // Wait a moment before refreshing and closing
        setTimeout(() => {
          router.refresh()
          onClose()
        }, 300) // 300ms delay
      }
      
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-yellow-100 text-gray-800 rounded-xl shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Barter Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Barter Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 rounded border border-gray-300"
              required
            >
              <option value="" disabled>Select type</option>
              <option value="item">Item</option>
              <option value="service">Service</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
