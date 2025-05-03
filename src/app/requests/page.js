'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

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

						return {
							...request,
							from_user: {
								username: userData?.username || 'Unknown User',
							},
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
				console.log('DEBUG post object:', request);
				console.log(
					'DEBUG post_id used for insert:',
					request.post_id,
					request.post_id
				);
				await supabase
					.from('barter_posts')
					.update({ status: 'completed' })
					.eq('id', request.post_id || request.post_id);
			}
		} catch (err) {
			setError(err.message);
		}
	};

	if (loading) return <div>Loading requests...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Barter Requests</h1>

			{requests.length === 0 ? (
				<p>No pending requests</p>
			) : (
				<div className="grid gap-6">
					{requests.map((request) => (
						<Card key={request.id} className="overflow-hidden">
							<CardHeader className="bg-gray-50 p-4">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-semibold">
											{request.barter_posts.name}
										</h3>
										<p className="text-sm text-gray-500">
											From:{' '}
											{request.from_user.raw_user_meta_data?.username ||
												'Unknown User'}
										</p>
									</div>
									<Badge
										className={`
                      ${request.status === 'pending' ? 'bg-yellow-500' : ''}
                      ${request.status === 'accepted' ? 'bg-green-500' : ''}
                      ${request.status === 'rejected' ? 'bg-red-500' : ''}
                    `}
									>
										{request.status}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="p-4">
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
												/>
											</div>
										)}
									</div>
								</div>
								{request.status === 'pending' && (
									<div className="flex gap-2 mt-4">
										<Button
											variant="outline"
											onClick={() =>
												handleRequestAction(request.id, 'rejected')
											}
										>
											Reject
										</Button>
										<Button
											onClick={() =>
												handleRequestAction(request.id, 'accepted')
											}
										>
											Accept
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
