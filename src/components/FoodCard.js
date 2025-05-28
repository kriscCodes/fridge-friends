'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BarterRequestModal from './BarterRequestModal';
import BuyConfirmationModal from './BuyConfirmationModal';
import { processPostImage } from '@/utils/imageUtils';
import { Button } from '@/components/ui/button';

export function FoodCard({ item }) {
	const [isBarterModalOpen, setIsBarterModalOpen] = useState(false);
	const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
	const [buyMessage, setBuyMessage] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [imageError, setImageError] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const loadImage = async () => {
			if (item?.image_url) {
				try {
					const url = await processPostImage(item.image_url);
					setImageUrl(url);
				} catch (error) {
					console.error('Error processing post image:', error);
					setImageError(true);
				}
			}
		};
		loadImage();
	}, [item?.image_url]);

	const handleBarter = () => {
		setIsBarterModalOpen(true);
	};

	const handleBuy = () => {
		setIsBuyModalOpen(true);
	};

	return (
		<>
			<div
				className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-2 items-stretch"
				style={{ imageRendering: 'pixelated', minWidth: 280, maxWidth: 340 }}
			>
				{item?.image_url && !imageError && (
					<div className="relative w-full h-40 overflow-hidden rounded-lg border-4 border-black">
						<Image
							src={imageUrl || '/placeholder.svg'}
							alt={item.name}
							fill
							className="object-cover"
							style={{ imageRendering: 'pixelated' }}
							onError={() => setImageError(true)}
						/>
					</div>
				)}
				{imageError && (
					<div className="w-full h-40 overflow-hidden rounded-lg border-4 border-black bg-gray-100 flex items-center justify-center">
						<p className="text-xs text-gray-500">Image not available</p>
						<Image
							src={'/placeholder.svg'}
							alt="Placeholder"
							width={40}
							height={40}
							className="object-contain"
						/>
					</div>
				)}

				<div>
					<div className="text-2xl text-black mb-1 uppercase font-bold truncate">
						{item.name}
					</div>
					<div className="text-xs text-gray-700 font-mono">
						{item.distance ? `${item.distance.toFixed(2)} miles away` : ''}
					</div>
					<p className="text-sm text-gray-700 line-clamp-2 font-bold font-mono">
						{item.description}
					</p>
				</div>

				<div className="text-sm text-gray-700 mt-1 font-bold font-mono">
					<p>From: {item.profiles?.username || 'Unknown'}</p>
					{item.price && (
						<p>
							<strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}
						</p>
					)}
				</div>

				<div className="flex gap-2 mt-2">
					<button
						onClick={handleBarter}
						className="w-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg border-2 border-black font-bold uppercase hover:bg-blue-700 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center"
						style={{ fontFamily: 'monospace' }}
					>
						Barter
					</button>
					<button
						onClick={handleBuy}
						className="w-1/2 bg-green-600 text-white px-4 py-2 rounded-lg border-2 border-black font-bold uppercase hover:bg-green-700 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-center"
						style={{ fontFamily: 'monospace' }}
					>
						Buy
					</button>
				</div>

				{buyMessage && (
					<div
						className="mt-2 text-sm font-mono text-center"
						style={{ color: buyMessage.includes('Error') ? 'red' : 'green' }}
					>
						{buyMessage}
					</div>
				)}
			</div>

			<BarterRequestModal
				isOpen={isBarterModalOpen}
				onClose={() => setIsBarterModalOpen(false)}
				post={item}
			/>

			<BuyConfirmationModal
				isOpen={isBuyModalOpen}
				onClose={() => setIsBuyModalOpen(false)}
				post={item}
			/>
		</>
	);
}
