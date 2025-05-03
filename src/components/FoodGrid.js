import { FoodCard } from '@/components/FoodCard';

// Sample food data
const foodItems = [
	{
		id: 1,
		name: 'Fresh Tomatoes',
		description: 'Homegrown organic tomatoes from my garden',
		image: '/placeholder.svg',
		category: 'produce',
		distance: '0.5 miles away',
		owner: 'Sarah K.',
	},
	{
		id: 2,
		name: 'Basil',
		description: 'Freshly cut basil, great for pasta and salads',
		image: '/placeholder.svg',
		category: 'herbs',
		distance: '0.8 miles away',
		owner: 'Mike T.',
	},
	{
		id: 3,
		name: 'Sourdough Starter',
		description: 'Active sourdough starter, 3 years old',
		image: '/placeholder.svg',
		category: 'ingredients',
		distance: '1.2 miles away',
		owner: 'Emma L.',
	},
	{
		id: 4,
		name: 'Zucchini',
		description: 'Fresh zucchini from my garden, have plenty to share',
		image: '/placeholder.svg',
		category: 'produce',
		distance: '0.3 miles away',
		owner: 'David R.',
	},
	{
		id: 5,
		name: 'Rosemary',
		description: 'Fragrant rosemary sprigs, freshly cut',
		image: '/placeholder.svg',
		category: 'herbs',
		distance: '1.5 miles away',
		owner: 'Lisa M.',
	},
	{
		id: 6,
		name: 'Homemade Jam',
		description: 'Strawberry jam made from berries in my garden',
		image: '/placeholder.svg',
		category: 'ingredients',
		distance: '0.7 miles away',
		owner: 'James P.',
	},
];

export default function FoodGrid({ category }) {
	// Filter items by category if provided
	const filteredItems = category
		? foodItems.filter((item) => item.category === category)
		: foodItems;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{filteredItems.map((item) => (
				<FoodCard key={item.id} item={item} />
			))}
		</div>
	);
}
