'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BarterRequestModal({ isOpen, onClose, post }) {
	const [offerName, setOfferName] = useState('');
	const [offerDescription, setOfferDescription] = useState('');
	const [offerImage, setOfferImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const router = useRouter();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setOfferImage(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('submit fired');
		setLoading(true);
		setError(null);

		try {
			// Get current user
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();
			if (userError) throw userError;

			// Upload image if provided
			let imageUrl = null;
			if (offerImage) {
				const fileExt = offerImage.name.split('.').pop();
				const fileName = `${Math.random()}.${fileExt}`;
				const { error: uploadError, data } = await supabase.storage
					.from('offer-images')
					.upload(fileName, offerImage);

				if (uploadError) throw uploadError;

				// Get the public URL for the uploaded image
				const {
					data: { publicUrl },
				} = supabase.storage.from('offer-images').getPublicUrl(fileName);

				imageUrl = publicUrl;
			}

			// Create barter request
			console.log('DEBUG barter_requests insert:', {
				post_id: post.post_id,
				from_user_id: user.id,
				to_user_id: post.user_id,
				offer_name: offerName,
				offer_description: offerDescription,
				offer_image: imageUrl,
				status: 'pending',
			});

			const { error: requestError, data: insertData } = await supabase
				.from('barter_requests')
				.insert({
					post_id: post.post_id,
					from_user_id: user.id,
					to_user_id: post.user_id,
					offer_name: offerName,
					offer_description: offerDescription,
					offer_image: imageUrl,
					status: 'pending',
				});
			console.log('insertData:', insertData, 'requestError:', requestError);

			if (requestError) throw requestError;

			// Close modal and refresh
			onClose();
			router.refresh();
		} catch (err) {
			setError(err.message);
			console.error('Barter request error:', err);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
			<div
				className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg"
				style={{ borderRadius: 0, imageRendering: 'pixelated' }}
			>
				<h2
					className="text-2xl font-bold mb-4 text-center font-mono uppercase tracking-widest"
					style={{ textShadow: '2px 2px 0px #000' }}
				>
					MAKE A BARTER OFFER
				</h2>
				<form onSubmit={handleSubmit} className="space-y-2">
					<div>
						<label className="block text-xs font-bold mb-1 font-mono uppercase tracking-widest">
							WHAT ARE YOU OFFERING?
						</label>
						<input
							type="text"
							value={offerName}
							onChange={(e) => setOfferName(e.target.value)}
							placeholder="E.G. FRESH BASIL, HOMEMADE BREAD..."
							required
							className="w-full px-2 py-1 border-4 border-black font-mono text-sm uppercase tracking-widest focus:outline-none"
							style={{ borderRadius: 0 }}
						/>
					</div>
					<div>
						<label className="block text-xs font-bold mb-1 font-mono uppercase tracking-widest">
							DESCRIPTION
						</label>
						<textarea
							value={offerDescription}
							onChange={(e) => setOfferDescription(e.target.value)}
							placeholder="TELL US MORE ABOUT YOUR OFFER..."
							required
							className="w-full px-2 py-1 border-4 border-black font-mono text-sm uppercase tracking-widest focus:outline-none min-h-[60px]"
							style={{ borderRadius: 0 }}
						/>
					</div>
					<div>
						<label className="block text-xs font-bold mb-1 font-mono uppercase tracking-widest">
							IMAGE (OPTIONAL)
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="w-full px-2 py-1 border-4 border-black font-mono text-xs focus:outline-none"
							style={{ borderRadius: 0 }}
						/>
						{imagePreview && (
							<div
								className="mt-2 mb-1 border-4 border-black"
								style={{
									width: 120,
									height: 120,
									imageRendering: 'pixelated',
									borderRadius: 0,
								}}
							>
								<img
									src={imagePreview}
									alt="Preview"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										imageRendering: 'pixelated',
										borderRadius: 0,
									}}
								/>
							</div>
						)}
					</div>
					<div className="flex justify-end gap-2 mt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-red-600 text-white font-mono font-bold uppercase border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
							style={{ borderRadius: 0, letterSpacing: '0.08em' }}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-green-600 text-white font-mono font-bold uppercase border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
							style={{ borderRadius: 0, letterSpacing: '0.08em' }}
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
