import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useState } from 'react';

export default function Request({ request, isIncoming, onStatusChange, onDelete }) {
	const [imageError, setImageError] = useState(false);
	const [actionMessage, setActionMessage] = useState(null);

	const handleAction = async (action) => {
		setActionMessage(null);

		if (action === 'accepted') {
			if (request.posts?.status !== 'active') {
				setActionMessage('Cannot accept: The item is no longer active.');
				return;
			}
		}

		if (onStatusChange) {
			await onStatusChange(request.id, action, request.posts?.post_id);
		}
	};

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
						<h3 className="font-semibold">{request.posts?.name || 'Unknown Item'}</h3>
						<p className="text-sm text-gray-500">
							{isIncoming ? (
								`From: ${request.from_profiles?.username || 'Unknown User'}`
							) : (
								`To: ${request.to_profiles?.username || 'Unknown User'}`
							)}
						</p>
					</div>
					<Badge
						className={`${request.status === 'pending' ? 'bg-yellow-500' : ''}
              ${request.status === 'accepted' ? 'bg-green-500' : ''}
              ${request.status === 'rejected' ? 'bg-red-500' : ''}
              ${request.status === 'completed' ? 'bg-blue-500' : ''}
              ${request.status === 'cancelled' ? 'bg-gray-500' : ''}`}
					>
						{request.status}
					</Badge>
				</div>
			</div>
			<div className="p-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h4 className="font-medium mb-2">{isIncoming ? 'Their Offer' : 'Your Offer'}:</h4>
						<p className="text-sm">{request.offer_name || 'No Name Provided'}</p>
						<p className="text-sm text-gray-600 mt-1">
							{request.offer_description || 'No Description Provided'}
						</p>
						{request.offer_image_url && !imageError && (
							<div className="mt-2 relative aspect-square w-32">
								<Image
									src={request.offer_image_url}
									alt={request.offer_name || 'Offer image'}
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
						<h4 className="font-medium mb-2">{isIncoming ? 'Your Item' : 'Requested Item'}:</h4>
						<p className="text-sm">{request.posts?.name || 'Unknown Item'}</p>
						<p className="text-sm text-gray-600 mt-1">
							{request.posts?.description || 'No Description Provided'}
						</p>
						{request.posts?.image_url && (
							<div className="mt-2 relative aspect-square w-32">
								<Image
									src={request.posts.image_url}
									alt={request.posts.name || 'Item image'}
									fill
									className="object-cover rounded"
									style={{ imageRendering: 'pixelated' }}
								/>
							</div>
						)}
					</div>
				</div>
				{isIncoming && request.status === 'pending' && (
					<div className="flex gap-2 mt-4">
						<button
							onClick={() => handleAction('accepted')}
							className="px-4 py-2 bg-green-600 text-white font-mono font-bold uppercase border-4 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all hover:bg-green-700"
							style={{
								letterSpacing: '0.08em',
								imageRendering: 'pixelated',
							}}
						>
							Accept
						</button>
						<button
							onClick={() => handleAction('rejected')}
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
				{!isIncoming && request.status === 'pending' && onDelete && (
					<div className="flex justify-end mt-4">
						<button
							onClick={() => onDelete(request.id)}
							className="px-4 py-2 bg-red-600 text-white font-mono font-bold uppercase border-4 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all hover:bg-red-700"
							style={{
								letterSpacing: '0.08em',
								imageRendering: 'pixelated',
							}}
						>
							Cancel Request
						</button>
					</div>
				)}
				{actionMessage && (
					<p className="text-red-600 text-sm font-mono mt-2 text-center">{actionMessage}</p>
				)}
			</div>
		</div>
	);
}
