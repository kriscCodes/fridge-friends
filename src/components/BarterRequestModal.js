'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadOfferImage } from '@/utils/imageUtils';
import { REQUEST_STATUS } from '@/constants/requestConstants';
import { createRequest } from '@/services/requests/requestService';
import PostDetails from '@/components/PostDetails';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function BarterRequestModal({ isOpen, onClose, post }) {
	const [offerName, setOfferName] = useState('');
	const [offerDescription, setOfferDescription] = useState('');
	const [offerImage, setOfferImage] = useState(null);
	const [offerImageUrl, setOfferImageUrl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const router = useRouter();

	useEffect(() => {
		// Clear form when modal opens
		if (isOpen) {
			setOfferName('');
			setOfferDescription('');
			setOfferImage(null);
			setOfferImageUrl(null);
			setError(null);
		}
	}, [isOpen]);

	const handleImageChange = async (event) => {
		const file = event.target.files?.[0];
		if (file) {
			setOfferImage(file);
			// Display image preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setOfferImageUrl(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Fetch user directly before submitting
		const { data: { user }, error: userError } = await supabase.auth.getUser();
		if (userError || !user) {
			setError('User not logged in or session expired.');
			console.error('Error fetching user:', userError);
			return;
		}

		if (!post) {
			setError('Post details missing.');
			return;
		}

		if (!offerName || !offerDescription) {
			setError('Please provide offer name and description.');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			let offerImageUrlForDb = null;
			if (offerImage) {
				offerImageUrlForDb = await uploadOfferImage(offerImage);
			}

			const newRequest = {
				post_id: post.post_id,
				from_user_id: user.id, // Use fetched user's ID
				to_user_id: post.user_id,
				offer_name: offerName,
				offer_description: offerDescription,
				offer_image: offerImageUrlForDb,
				status: REQUEST_STATUS.PENDING,
				trade_type: 'barter',
				requester_status: false,
				poster_status: false,
			};

			await createRequest(newRequest);

			// Clear form and close modal on success
			setOfferName('');
			setOfferDescription('');
			setOfferImage(null);
			setOfferImageUrl(null);
			onClose();
			router.refresh();
		} catch (err) {
			console.error('Error creating barter request:', err);
			setError('Failed to create barter request.');
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	const modalContent = (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] overflow-y-auto">
			<div className="bg-white border-4 border-black p-6 max-w-2xl w-full mx-4 my-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-y-auto max-h-[calc(100vh-2rem)]">
				<h2
					className="text-2xl font-bold mb-4 uppercase"
					style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
				>
					Make a Barter Offer
				</h2>

				<PostDetails post={post} showDeadline={true} />

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
							id="offer-name"
							value={offerName}
							onChange={(e) => setOfferName(e.target.value)}
							className="w-full"
							required
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
							id="offer-description"
							value={offerDescription}
							onChange={(e) => setOfferDescription(e.target.value)}
							className="w-full"
							required
							style={{ fontFamily: 'monospace' }}
						/>
						
					</div>

					<div>
						<label htmlFor="offer-image" className="block text-xs font-bold mb-1 font-mono uppercase tracking-widest">
							IMAGE (OPTIONAL)
						</label>
						<Input
							id="offer-image"
							type="file"
							accept="image/*,.heic"
							onChange={handleImageChange}
							className="mt-1 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-[1px] file:border-black file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
						/>
						{offerImageUrl && (
							<div className="mt-4 relative w-32 h-32 rounded-md overflow-hidden">
								<Image src={offerImageUrl} alt="Offer Preview" fill style={{ objectFit: 'cover' }} />
							</div>
						)}
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
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
							disabled={loading}
							className="px-4 py-2 bg-green-600 text-white font-mono font-bold uppercase border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
							style={{ borderRadius: 0, letterSpacing: '0.08em' }}
						>
							{loading ? 'Sending Offer...' : 'Send Offer'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);

	if (typeof window !== 'undefined') {
		return createPortal(modalContent, document.body);
	}
	return null;
}
