'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import heic2any from 'heic2any';

export default function BarterRequestModal({ isOpen, onClose, post }) {
	const [offerName, setOfferName] = useState('');
	const [offerDescription, setOfferDescription] = useState('');
	const [offerImage, setOfferImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const router = useRouter();

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			// Check if the file is HEIC
			if (
				file.type === 'image/heic' ||
				file.name.toLowerCase().endsWith('.heic')
			) {
				// Convert HEIC to JPEG
				const convertedBlob = await heic2any({
					blob: file,
					toType: 'image/jpeg',
					quality: 0.8,
				});

				// Create a new File object from the converted blob
				const convertedFile = new File(
					[convertedBlob],
					file.name.replace(/\.heic$/i, '.jpg'),
					{ type: 'image/jpeg' }
				);

				setOfferImage(convertedFile);
				setImagePreview(URL.createObjectURL(convertedFile));
			} else {
				setOfferImage(file);
				setImagePreview(URL.createObjectURL(file));
			}
		} catch (error) {
			console.error('Error converting image:', error);
			setError('Failed to process image. Please try a different file.');
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
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white border-4 border-black p-6 max-w-2xl w-full mx-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
				<h2
					className="text-2xl font-bold mb-4 uppercase"
					style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
				>
					Make a Barter Offer
				</h2>

				{error && (
					<div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							className="block text-sm font-bold mb-1 uppercase"
							style={{ fontFamily: 'monospace' }}
						>
							What are you offering?
						</label>
						<Input
							type="text"
							value={offerName}
							onChange={(e) => setOfferName(e.target.value)}
							required
							className="w-full"
							style={{ fontFamily: 'monospace' }}
						/>
					</div>

					<div>
						<label
							className="block text-sm font-bold mb-1 uppercase"
							style={{ fontFamily: 'monospace' }}
						>
							Description
						</label>
						<Textarea
							value={offerDescription}
							onChange={(e) => setOfferDescription(e.target.value)}
							required
							className="w-full"
							style={{ fontFamily: 'monospace' }}
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
