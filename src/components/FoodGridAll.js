import { FoodCard } from '@/components/FoodCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FoodGrid({ category }) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);

			let query = supabase
				.from('barter_posts')
				.select(
					`
					*,
					profiles (
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
				setPosts(data);
			}

			setLoading(false);
		};

		fetchPosts();
	}, [category]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;
	if (!posts.length) return <div>No posts found.</div>;

	return (
        <>
        <h2
        className="text-2xl font-bold mb-4 text-white uppercase"
        style={{ fontFamily: "monospace", textShadow: "2px 2px 0px #000" }}
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
