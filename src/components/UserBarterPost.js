'use client'

export default function UserBarterPost({ post }) {
  return (
    <div className="bg-yellow-50 text-gray-800 border border-yellow-200 rounded-xl p-4 shadow hover:shadow-md flex flex-col justify-between h-60">
      <div>
        <h3 className="text-lg font-bold mb-1 truncate">{post.name}</h3>
        <p className="text-sm text-gray-700 line-clamp-3">{post.description}</p>
      </div>

      <div className="text-sm text-gray-700 mt-2">
        <p><strong>Type:</strong> {post.type}</p>
        <p><strong>Barter:</strong> {post.barter_type}</p>
        <p><strong>Deadline:</strong> {new Date(post.deadline).toLocaleDateString()}</p>
      </div>
    </div>
  )
}
