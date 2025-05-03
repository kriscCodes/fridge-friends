'use client';

import ExploreNavbar from '../../components/ExploreNavbar';
import FoodGrid from '@/components/FoodGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserBarterPosts from '@/components/UserBarterPosts';

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
			<ExploreNavbar />

			<main className="container mx-auto px-4 py-8">
				<Tabs defaultValue="all" className="w-full">
					<TabsList className="grid w-full grid-cols-4 mb-8">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="produce">Produce</TabsTrigger>
						<TabsTrigger value="herbs">Herbs</TabsTrigger>
						<TabsTrigger value="ingredients">Ingredients</TabsTrigger>
					</TabsList>

					<TabsContent value="all" className="mt-0">
						<FoodGrid/>
					</TabsContent>
					<TabsContent value="produce" className="mt-0">
						<FoodGrid category="produce" />
					</TabsContent>
					<TabsContent value="herbs" className="mt-0">
						<FoodGrid category="herbs" />
					</TabsContent>
					<TabsContent value="ingredients" className="mt-0">
						<FoodGrid category="ingredients" />
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
