'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

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

			const { error: requestError } = await supabase
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

			if (requestError) throw requestError;

			// Close modal and refresh
			onClose();
			router.refresh();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
				<h2 className="text-2xl font-bold mb-6 text-center">
					Make a Barter Offer
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							What are you offering?
						</label>
						<Input
							type="text"
							value={offerName}
							onChange={(e) => setOfferName(e.target.value)}
							placeholder="e.g., Fresh Basil, Homemade Bread..."
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">
							Description
						</label>
						<Textarea
							value={offerDescription}
							onChange={(e) => setOfferDescription(e.target.value)}
							placeholder="Describe what you're offering..."
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">
							Image (optional)
						</label>
						{imagePreview && (
							<div className="mb-2">
								<img
									src={imagePreview}
									alt="Preview"
									className="max-h-32 rounded-lg"
								/>
							</div>
						)}
						<Input type="file" accept="image/*" onChange={handleImageChange} />
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<div className="flex justify-end space-x-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? 'Sending...' : 'Send Offer'}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
