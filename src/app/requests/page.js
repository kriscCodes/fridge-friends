'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

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
							const { data: offerImageData } = supabase.storage
								.from('offer-images')
								.getPublicUrl(request.offer_image);
							offerImageUrl = offerImageData.publicUrl;
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
							<div
								key={request.id}
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
											<h3 className="font-semibold">
												{request.barter_posts.name}
											</h3>
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
											{request.offer_image && (
												<div className="mt-2 relative aspect-square w-32">
													<Image
														src={request.offer_image}
														alt={request.offer_name}
														fill
														className="object-cover rounded"
														style={{ imageRendering: 'pixelated' }}
													/>
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
												onClick={() =>
													handleRequestAction(request.id, 'accepted')
												}
												className="px-4 py-2 bg-green-600 text-white font-mono font-bold uppercase border-4 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all hover:bg-green-700"
												style={{
													letterSpacing: '0.08em',
													imageRendering: 'pixelated',
												}}
											>
												Accept
											</button>
											<button
												onClick={() =>
													handleRequestAction(request.id, 'rejected')
												}
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
						))}
					</div>
				)}
			</main>
		</>
	);
}
