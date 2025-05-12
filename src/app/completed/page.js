'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function CompletedBartersPage() {
	const [barters, setBarters] = useState([]);
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

				const { data: bartersData, error: bartersError } = await supabase
					.from('barter_requests')
					.select(`*, barter_posts:post_id (name, description, image_url)`)
					.or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
					.eq('status', 'completed')
					.order('created_at', { ascending: false });

				if (bartersError) throw bartersError;

				// Fetch usernames and images for each barter
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
					Loading completed barters...
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
						Completed Barters
					</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{barters.length === 0 ? (
							<p
								className="text-white text-xl font-bold"
								style={{
									fontFamily: 'monospace',
									textShadow: '2px 2px 0px #000',
								}}
							>
								No completed barters
							</p>
						) : (
							barters.map((barter) => (
								<div
									key={barter.id}
									className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2 items-stretch"
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
													{barter.barter_posts.name}
												</h3>
												<p className="text-sm text-gray-500">
													Traded with:{' '}
													{barter.from_user_id === currentUser?.id
														? barter.to_user.username
														: barter.from_user.username}
												</p>
											</div>
											<span className="bg-green-500 text-white px-4 py-2 rounded-lg border-2 border-black font-bold uppercase">
												Completed
											</span>
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
				</div>
			</main>
		</>
	);
}
