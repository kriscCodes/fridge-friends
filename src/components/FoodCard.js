'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import BarterRequestModal from './BarterRequestModal';
import { useRouter } from 'next/navigation';
import StripePaymentButton from './StripePaymentButton';

export function FoodCard({ item }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState(null);
	const router = useRouter();
	const [buyMessage, setBuyMessage] = useState(null);

	useEffect(() => {
		if (item.image_url) {
			const { data } = supabase.storage
				.from('barter-images')
				.getPublicUrl(item.image_url);
			setImageUrl(data.publicUrl);
		}
	}, [item.image_url]);

	const handleBuy = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		console.log('Buy clicked! User:', user, 'Item:', item);
		if (!user) {
			setBuyMessage('You must be logged in to buy.');
			return;
		}
		const payload = {
			post_id: item.id || item.post_id,
			from_user_id: user.id,
			to_user_id: item.user_id,
			offer_name: 'Buy',
			status: 'accepted',
		};
		console.log('Inserting barter_request:', payload);
		const { error } = await supabase.from('barter_requests').insert(payload);
		if (error) {
			setBuyMessage('Error creating buy request: ' + error.message);
		} else {
			setBuyMessage('Purchase started! Check your ongoing barters.');
		}
	};

	const handlePaymentSuccess = () => {
		setBuyMessage('Payment successful! Check your ongoing purchases.');
	};

	const handlePaymentError = (error) => {
		setBuyMessage('Payment failed: ' + error);
	};

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
					{item.price && (
						<p>
							<strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}
						</p>
					)}
				</div>

				<div className="flex flex-row gap-2 mt-2 items-center">
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex justify-center items-center focus:outline-none border-none bg-transparent p-0 transition-transform hover:scale-105 active:scale-95"
						aria-label="Barter for this item"
						style={{ fontFamily: 'monospace', height: '28px' }}
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
					{item.price ? (
						<StripePaymentButton
							amount={Math.round(parseFloat(item.price) * 100)}
							itemName={item.name}
							onSuccess={handlePaymentSuccess}
							onError={handlePaymentError}
						/>
					) : (
						<button
							onClick={handleBuy}
							className="flex justify-center items-center focus:outline-none border-4 border-blue-900 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-[8px] px-4 py-1"
							aria-label="Buy this item"
							style={{
								fontFamily: 'monospace',
								imageRendering: 'pixelated',
								letterSpacing: '2px',
								height: '28px',
								minWidth: '80px',
								marginTop: '0px',
							}}
						>
							<span
								className="text-lg font-bold"
								style={{
									fontFamily: 'monospace',
									color: '#fff',
									textShadow: '2px 2px 0 #000',
									letterSpacing: '2px',
									fontSize: '18px',
									lineHeight: '18px',
								}}
							>
								BUY
							</span>
						</button>
					)}
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
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				post={item}
			/>
		</>
	);
}
