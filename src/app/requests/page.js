'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Request from '@/components/Request';

export default function RequestsPage() {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const {
					data: { user },
					error: userError,
				} = await supabase.auth.getUser();
				if (userError) throw userError;

				// First fetch the requests
				const { data: requestsData, error: requestError } = await supabase
					.from('barter_requests')
					.select(
						`
						*,
						barter_posts:post_id (
							name,
							description,
							image_url
						)
					`
					)
					.eq('to_user_id', user.id)
					.order('created_at', { ascending: false });

				if (requestError) throw requestError;

				// Then fetch user data for each request
				const requestsWithUsers = await Promise.all(
					requestsData.map(async (request) => {
						const { data: userData } = await supabase
							.from('profiles')
							.select('username')
							.eq('id', request.from_user_id)
							.single();

						// Get public URLs for images
						let postImageUrl = null;
						let offerImageUrl = null;

						if (request.barter_posts?.image_url) {
							const { data: postImageData } = supabase.storage
								.from('barter-images')
								.getPublicUrl(request.barter_posts.image_url);
							postImageUrl = postImageData.publicUrl;
						}

						if (request.offer_image) {
							// Check if the offer_image is already a full URL
							if (request.offer_image.startsWith('http')) {
								offerImageUrl = request.offer_image;
							} else {
								// If it's just a filename, get the public URL
								const { data: offerImageData } = supabase.storage
									.from('offer-images')
									.getPublicUrl(request.offer_image);
								offerImageUrl = offerImageData.publicUrl;
							}
						}

						return {
							...request,
							from_user: {
								username: userData?.username || 'Unknown User',
							},
							barter_posts: {
								...request.barter_posts,
								image: postImageUrl,
							},
							offer_image: offerImageUrl,
						};
					})
				);

				setRequests(requestsWithUsers);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchRequests();
	}, []);

	const handleRequestAction = async (requestId, action) => {
		try {
			const { error } = await supabase
				.from('barter_requests')
				.update({ status: action })
				.eq('id', requestId);

			if (error) throw error;

			// Update local state
			setRequests(
				requests.map((request) =>
					request.id === requestId ? { ...request, status: action } : request
				)
			);

			// If accepted, update the post status
			if (action === 'accepted') {
				const request = requests.find((r) => r.id === requestId);
				await supabase
					.from('barter_posts')
					.update({ status: 'completed' })
					.eq('id', request.post_id);
			}
		} catch (err) {
			setError(err.message);
		}
	};

	if (loading)
		return (
			<div
				className="min-h-screen w-full flex items-center justify-center"
				style={{
					backgroundImage: "url('/images/BarterRequestsbg.png')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					imageRendering: 'pixelated',
				}}
			>
				<p
					className="text-white text-2xl font-bold"
					style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}
				>
					Loading requests...
				</p>
			</div>
		);

	if (error) return <div className="text-red-500 p-8 font-mono">{error}</div>;

	return (
		<>
			<Navbar />
			<main
				className="flex flex-col items-center min-h-screen p-6"
				style={{
					backgroundImage: "url('/images/BarterRequestsbg.png')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					imageRendering: 'pixelated',
				}}
			>
				<h1
					className="text-2xl font-bold mb-6 text-white"
					style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}
				>
					Barter Requests
				</h1>

				{requests.length === 0 ? (
					<p
						className="text-white text-xl font-bold"
						style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}
					>
						No pending requests
					</p>
				) : (
					<div className="grid gap-8">
						{requests.map((request) => (
							<Request
								key={request.id}
								request={request}
								onRequestAction={handleRequestAction}
							/>
						))}
					</div>
				)}
			</main>
		</>
	);
}
