import { FoodCard } from '@/components/FoodCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ItemGridAll({ category }) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
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
				console.log('Current userId:', userId);
				console.log(
					'Fetched posts:',
					data.map((p) => ({ id: p.id, user_id: p.user_id }))
				);
				let filtered = data;
				if (userId) {
					filtered = filtered.filter((post) => post.user_id !== userId);
				}
				console.log(
					'Filtered posts:',
					filtered.map((p) => ({ id: p.id, user_id: p.user_id }))
				);
				setPosts(filtered);
			}

			setLoading(false);
		};

		fetchPosts();
	}, [category, userId]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;
	if (!posts.length) return <div>No posts found.</div>;

	return (
		<>
			<h2
				className="text-2xl font-bold mb-4 text-white uppercase"
				style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}
			>
				ALL BARTER:
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{posts.map((item) => (
					<FoodCard key={item.id || item.post_id} item={item} />
				))}
			</div>
		</>
	);
}
