'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Bell } from 'lucide-react';

export default function TradesPage() {
	const [ongoing, setOngoing] = useState([]);
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTrades = async () => {
			try {
				const {
					data: { user },
					error: userError,
				} = await supabase.auth.getUser();
				if (userError) throw userError;

				// Fetch ongoing trades (accepted)
				const { data: ongoingData, error: ongoingError } = await supabase
					.from('barter_requests')
					.select(
						`*, barter_posts:post_id (name, description, image_url), from_user_id, to_user_id, offer_name, offer_description, offer_image, status`
					)
					.or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
					.eq('status', 'accepted')
					.order('created_at', { ascending: false });
				if (ongoingError) throw ongoingError;

				// Fetch history (completed/cancelled)
				const { data: historyData, error: historyError } = await supabase
					.from('barter_requests')
					.select(
						`*, barter_posts:post_id (name, description, image_url), from_user_id, to_user_id, offer_name, offer_description, offer_image, status`
					)
					.or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
					.in('status', ['completed', 'cancelled'])
					.order('created_at', { ascending: false });
				if (historyError) throw historyError;

				setOngoing(ongoingData);
				setHistory(historyData);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchTrades();
	}, []);

	const updateStatus = async (id, newStatus) => {
		setLoading(true);
		setError(null);
		try {
			const { error } = await supabase
				.from('barter_requests')
				.update({ status: newStatus })
				.eq('id', id);
			if (error) throw error;
			// Refresh the lists
			window.location.reload();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div>Loading trades...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Ongoing Trades</h1>
			{ongoing.length === 0 ? (
				<p>No ongoing trades.</p>
			) : (
				<div className="grid gap-6 mb-10">
					{ongoing.map((trade) => (
						<Card key={trade.id} className="overflow-hidden">
							<CardHeader className="bg-gray-50 p-4 flex flex-col gap-2">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-semibold">
											{trade.barter_posts?.name}
										</h3>
										<p className="text-sm text-gray-500">
											Offer: {trade.offer_name}
										</p>
									</div>
									<Badge className="bg-blue-500">{trade.status}</Badge>
								</div>
								<div className="text-xs text-gray-400">
									Pickup Note: {trade.pickup_note || 'N/A'}
								</div>
							</CardHeader>
							<CardContent className="p-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<h4 className="font-medium mb-2">Their Offer:</h4>
										<p className="text-sm">{trade.offer_name}</p>
										<p className="text-sm text-gray-600 mt-1">
											{trade.offer_description}
										</p>
										{trade.offer_image && (
											<div className="mt-2 relative aspect-square w-32">
												<Image
													src={trade.offer_image}
													alt={trade.offer_name}
													fill
													className="object-cover rounded"
												/>
											</div>
										)}
									</div>
									<div>
										<h4 className="font-medium mb-2">Your Item:</h4>
										<p className="text-sm">{trade.barter_posts?.name}</p>
										<p className="text-sm text-gray-600 mt-1">
											{trade.barter_posts?.description}
										</p>
										{trade.barter_posts?.image_url && (
											<div className="mt-2 relative aspect-square w-32">
												<Image
													src={trade.barter_posts.image_url}
													alt={trade.barter_posts.name}
													fill
													className="object-cover rounded"
												/>
											</div>
										)}
									</div>
								</div>
								<div className="flex gap-2 mt-4">
									<Button
										variant="outline"
										onClick={() => updateStatus(trade.id, 'cancelled')}
									>
										Cancel
									</Button>
									<Button onClick={() => updateStatus(trade.id, 'completed')}>
										Mark as Complete
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<h2 className="text-xl font-bold mb-4">Trade History</h2>
			{history.length === 0 ? (
				<p>No past trades.</p>
			) : (
				<div className="grid gap-6">
					{history.map((trade) => (
						<Card key={trade.id} className="overflow-hidden opacity-70">
							<CardHeader className="bg-gray-50 p-4 flex flex-col gap-2">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-semibold">
											{trade.barter_posts?.name}
										</h3>
										<p className="text-sm text-gray-500">
											Offer: {trade.offer_name}
										</p>
									</div>
									<Badge
										className={
											trade.status === 'completed'
												? 'bg-green-500'
												: 'bg-red-500'
										}
									>
										{trade.status}
									</Badge>
								</div>
								<div className="text-xs text-gray-400">
									Pickup Note: {trade.pickup_note || 'N/A'}
								</div>
							</CardHeader>
							<CardContent className="p-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<h4 className="font-medium mb-2">Their Offer:</h4>
										<p className="text-sm">{trade.offer_name}</p>
										<p className="text-sm text-gray-600 mt-1">
											{trade.offer_description}
										</p>
										{trade.offer_image && (
											<div className="mt-2 relative aspect-square w-32">
												<Image
													src={trade.offer_image}
													alt={trade.offer_name}
													fill
													className="object-cover rounded"
												/>
											</div>
										)}
									</div>
									<div>
										<h4 className="font-medium mb-2">Your Item:</h4>
										<p className="text-sm">{trade.barter_posts?.name}</p>
										<p className="text-sm text-gray-600 mt-1">
											{trade.barter_posts?.description}
										</p>
										{trade.barter_posts?.image_url && (
											<div className="mt-2 relative aspect-square w-32">
												<Image
													src={trade.barter_posts.image_url}
													alt={trade.barter_posts.name}
													fill
													className="object-cover rounded"
												/>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
