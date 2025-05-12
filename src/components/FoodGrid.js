import { FoodCard } from '@/components/FoodCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function haversine(lat1, lon1, lat2, lon2) {
	const R = 3958.8; // miles
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

export default function ItemGrid({ category }) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [userLocation, setUserLocation] = useState(null);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUserId(user?.id || null);
		};
		fetchUser();
	}, []);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					setUserLocation({
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
					});
				},
				(err) => {
					setUserLocation(null);
				}
			);
		}
	}, []);

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);

			let query = supabase
				.from('barter_posts')
				.select(
					`
	*
	,profiles (
		username
	)
`
				)
				.order('created_at', { ascending: false });

			if (category) {
				query = query.eq('category', category);
			}

			const { data, error } = await query;

			if (error) {
				setError(error.message);
			} else {
				let filtered = data;
				if (userId) {
					filtered = filtered.filter((post) => post.user_id !== userId);
				}
				if (userLocation) {
					filtered = filtered
						.map((post) => {
							if (post.latitude && post.longitude) {
								const distance = haversine(
									userLocation.latitude,
									userLocation.longitude,
									post.latitude,
									post.longitude
								);
								return { ...post, distance };
							}
							return { ...post, distance: null };
						})
						.filter((post) => post.distance !== null && post.distance <= 0.5) // 0.5 miles
						.sort((a, b) => a.distance - b.distance);
				}
				setPosts(filtered);
			}

			setLoading(false);
		};

		fetchPosts();
	}, [category, userLocation, userId]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;
	if (!posts.length) return <div>No posts found.</div>;

	return (
		<>
			<h2
				className="text-2xl font-bold mb-4 text-white uppercase"
				style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}
			>
				NEARBY BARTER :
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{posts.map((item) => (
					<FoodCard key={item.id || item.post_id} item={item} />
				))}
			</div>
		</>
	);
}
