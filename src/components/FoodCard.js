'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import BarterRequestModal from './BarterRequestModal';

export function FoodCard({ item }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState(null);

	useEffect(() => {
		if (item.image_url) {
			const { data } = supabase.storage
				.from('barter-images')
				.getPublicUrl(item.image_url);
			setImageUrl(data.publicUrl);
		}
	}, [item.image_url]);

	return (
		<>
			<div
				className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-2 items-stretch"
				style={{ imageRendering: 'pixelated', minWidth: 280, maxWidth: 340 }}
			>
				{imageUrl && (
					<div className="relative w-full h-40 overflow-hidden rounded-lg border-4 border-black">
						<Image
							src={imageUrl || '/placeholder.svg'}
							alt={item.name}
							fill
							className="object-cover"
							style={{ imageRendering: 'pixelated' }}
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
				</div>

				<button
					onClick={() => setIsModalOpen(true)}
					className="mt-2 flex justify-center items-center focus:outline-none border-none bg-transparent p-0 transition-transform hover:scale-105 active:scale-95"
					aria-label="Barter for this item"
					style={{ fontFamily: 'monospace' }}
				>
					<Image
						src="/images/Barterbutton.png"
						alt="Barter"
						width={80}
						height={28}
						className="object-contain"
						style={{ imageRendering: 'pixelated' }}
					/>
				</button>
			</div>

			<BarterRequestModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				post={item}
			/>
		</>
	);
}
