import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useState } from 'react';

export default function Request({ request, onRequestAction }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-2 items-stretch"
      style={{
        imageRendering: 'pixelated',
        minWidth: 280,
        maxWidth: 340,
      }}
    >
      <div className="bg-gray-50 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{request.barter_posts.name}</h3>
            <p className="text-sm text-gray-500">
              From: {request.from_user.username}
            </p>
          </div>
          <Badge
            className={`${
              request.status === 'pending' ? 'bg-yellow-500' : ''
            }
              ${request.status === 'accepted' ? 'bg-green-500' : ''}
              ${request.status === 'rejected' ? 'bg-red-500' : ''}`}
          >
            {request.status}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Their Offer:</h4>
            <p className="text-sm">{request.offer_name}</p>
            <p className="text-sm text-gray-600 mt-1">
              {request.offer_description}
            </p>
            {request.offer_image && !imageError && (
              <div className="mt-2 relative aspect-square w-32">
                <Image
                  src={request.offer_image}
                  alt={request.offer_name}
                  fill
                  className="object-cover rounded"
                  style={{ imageRendering: 'pixelated' }}
                  onError={() => setImageError(true)}
                />
              </div>
            )}
            {imageError && (
              <div className="mt-2 aspect-square w-32 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-xs text-gray-500">Image not available</p>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium mb-2">Your Item:</h4>
            <p className="text-sm">{request.barter_posts.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              {request.barter_posts.description}
            </p>
            {request.barter_posts.image && (
              <div className="mt-2 relative aspect-square w-32">
                <Image
                  src={request.barter_posts.image}
                  alt={request.barter_posts.name}
                  fill
                  className="object-cover rounded"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            )}
          </div>
        </div>
        {request.status === 'pending' && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onRequestAction(request.id, 'accepted')}
              className="px-4 py-2 bg-green-600 text-white font-mono font-bold uppercase border-4 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all hover:bg-green-700"
              style={{
                letterSpacing: '0.08em',
                imageRendering: 'pixelated',
              }}
            >
              Accept
            </button>
            <button
              onClick={() => onRequestAction(request.id, 'rejected')}
              className="px-4 py-2 bg-red-600 text-white font-mono font-bold uppercase border-4 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all hover:bg-red-700"
              style={{
                letterSpacing: '0.08em',
                imageRendering: 'pixelated',
              }}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 