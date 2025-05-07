'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';

export default function OngoingBartersPage() {
	const [barters, setBarters] = useState([]);
	const [selectedBarter, setSelectedBarter] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setCurrentUser(user);
		};
		fetchUser();
	}, []);

	useEffect(() => {
		const fetchBarters = async () => {
			try {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) throw new Error('No user found');

				// Fetch barters (no join)
				const { data: bartersData, error: bartersError } = await supabase
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
					.or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
					.eq('status', 'accepted')
					.order('created_at', { ascending: false });

				if (bartersError) throw bartersError;

				// Fetch usernames for each barter
				const bartersWithUsernames = await Promise.all(
					bartersData.map(async (barter) => {
						const { data: fromProfile } = await supabase
							.from('profiles')
							.select('username')
							.eq('id', barter.from_user_id)
							.single();

						const { data: toProfile } = await supabase
							.from('profiles')
							.select('username')
							.eq('id', barter.to_user_id)
							.single();

						let postImageUrl = null;
						let offerImageUrl = null;

						if (barter.barter_posts?.image_url) {
							const { data: postImageData } = supabase.storage
								.from('barter-images')
								.getPublicUrl(barter.barter_posts.image_url);
							postImageUrl = postImageData.publicUrl;
						}

						if (barter.offer_image) {
							const { data: offerImageData } = supabase.storage
								.from('offer-images')
								.getPublicUrl(barter.offer_image);
							offerImageUrl = offerImageData.publicUrl;
						}

						return {
							...barter,
							barter_posts: {
								...barter.barter_posts,
								image: postImageUrl,
							},
							offer_image: offerImageUrl,
							from_user: { username: fromProfile?.username || 'Unknown User' },
							to_user: { username: toProfile?.username || 'Unknown User' },
						};
					})
				);

				setBarters(bartersWithUsernames);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchBarters();
	}, []);

	useEffect(() => {
		if (!selectedBarter) return;

		// Subscribe to new messages
		const subscription = supabase
			.channel(`barter_messages:${selectedBarter.id}`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'barter_messages',
					filter: `barter_id=eq.${selectedBarter.id}`,
				},
				(payload) => {
					setMessages((current) => {
						// Check for duplicate by created_at and content (or use a better unique key)
						if (
							current.some(
								(msg) =>
									msg.created_at === payload.new.created_at &&
									msg.content === payload.new.content
							)
						) {
							return current;
						}
						return [...current, payload.new];
					});
				}
			)
			.subscribe();

		// Fetch existing messages
		const fetchMessages = async () => {
			const { data: messagesData, error: messagesError } = await supabase
				.from('barter_messages')
				.select('*')
				.eq('barter_id', selectedBarter.id)
				.order('created_at', { ascending: true });

			if (messagesError) {
				console.error('Error fetching messages:', messagesError);
				return;
			}

			setMessages(messagesData);
		};

		fetchMessages();

		return () => {
			subscription.unsubscribe();
		};
	}, [selectedBarter]);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!newMessage.trim() || !selectedBarter || !currentUser) return;

		try {
			const { error } = await supabase.from('barter_messages').insert({
				barter_id: selectedBarter.id,
				sender_id: currentUser.id,
				content: newMessage.trim(),
			});

			if (error) throw error;
			setNewMessage('');
		} catch (err) {
			console.error('Error sending message:', err);
		}
	};

	if (loading) {
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
					Loading barters...
				</p>
			</div>
		);
	}

	if (error) return <div className="text-red-500 p-8 font-mono">{error}</div>;

	return (
		<>
			<Navbar />
			<main
				className="flex min-h-screen p-6"
				style={{
					backgroundImage: "url('/images/BarterRequestsbg.png')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					imageRendering: 'pixelated',
				}}
			>
				<div className="w-full max-w-4xl mx-auto">
					<h1
						className="text-2xl font-bold mb-6 text-white"
						style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}
					>
						Ongoing Barters
					</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Barter List */}
						<div className="space-y-4">
							{barters.length === 0 ? (
								<p
									className="text-white text-xl font-bold"
									style={{
										fontFamily: 'monospace',
										textShadow: '2px 2px 0px #000',
									}}
								>
									No ongoing barters
								</p>
							) : (
								barters.map((barter) => (
									<div
										key={barter.id}
										className={`bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-2 items-stretch cursor-pointer ${
											selectedBarter?.id === barter.id
												? 'ring-2 ring-blue-500'
												: ''
										}`}
										style={{
											imageRendering: 'pixelated',
											minWidth: 280,
											maxWidth: 340,
										}}
										onClick={() => setSelectedBarter(barter)}
									>
										<div className="bg-gray-50 p-4">
											<div className="flex justify-between items-start">
												<div>
													<h3 className="font-semibold">
														{barter.barter_posts.name}
													</h3>
													<p className="text-sm text-gray-500">
														Trading with:{' '}
														{barter.from_user_id === currentUser?.id
															? barter.to_user.username
															: barter.from_user.username}
													</p>
												</div>
											</div>
										</div>
										<div className="p-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<h4 className="font-medium mb-2">Their Offer:</h4>
													<p className="text-sm">{barter.offer_name}</p>
													{barter.offer_image && (
														<div className="mt-2 relative aspect-square w-24">
															<Image
																src={barter.offer_image}
																alt={barter.offer_name}
																fill
																className="object-cover rounded"
																style={{ imageRendering: 'pixelated' }}
															/>
														</div>
													)}
												</div>
												<div>
													<h4 className="font-medium mb-2">Your Item:</h4>
													<p className="text-sm">{barter.barter_posts.name}</p>
													{barter.barter_posts.image && (
														<div className="mt-2 relative aspect-square w-24">
															<Image
																src={barter.barter_posts.image}
																alt={barter.barter_posts.name}
																fill
																className="object-cover rounded"
																style={{ imageRendering: 'pixelated' }}
															/>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>

						{/* Chat Section */}
						{selectedBarter && (
							<div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-[600px]">
								<div className="flex-1 overflow-y-auto mb-4 space-y-4">
									{messages.map((message) => (
										<div
											key={message.id}
											className={`flex ${
												message.sender_id === currentUser?.id
													? 'justify-end'
													: 'justify-start'
											}`}
										>
											<div
												className={`max-w-[70%] rounded-lg p-3 ${
													message.sender_id === currentUser?.id
														? 'bg-blue-500 text-white'
														: 'bg-gray-200 text-gray-800'
												}`}
											>
												<p className="text-sm">{message.content}</p>
												<p className="text-xs mt-1 opacity-70">
													{new Date(message.created_at).toLocaleTimeString()}
												</p>
											</div>
										</div>
									))}
								</div>
								<form onSubmit={handleSendMessage} className="flex gap-2">
									<Input
										type="text"
										value={newMessage}
										onChange={(e) => setNewMessage(e.target.value)}
										placeholder="Type your message..."
										className="flex-1"
									/>
									<Button type="submit">Send</Button>
								</form>
							</div>
						)}
					</div>
				</div>
			</main>
		</>
	);
}
