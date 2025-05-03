'use client';

import Navbar from '../../components/Navbar';
import { Search } from 'lucide-react';
import FoodGrid from '@/components/FoodGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
			<header className="bg-white shadow-sm">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col gap-6">
						<div className="flex items-center justify-between">
							<h1 className="text-2xl font-bold text-green-700">
								Fridge Friends
							</h1>
							<Button variant="outline" className="hidden sm:flex">
								Share Your Food
							</Button>
						</div>

						<div className="relative">
							<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search for produce, herbs, ingredients..."
								className="pl-10 bg-gray-50"
							/>
						</div>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8">
				<Tabs defaultValue="all" className="w-full">
					<TabsList className="grid w-full grid-cols-4 mb-8">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="produce">Produce</TabsTrigger>
						<TabsTrigger value="herbs">Herbs</TabsTrigger>
						<TabsTrigger value="ingredients">Ingredients</TabsTrigger>
					</TabsList>

					<TabsContent value="all" className="mt-0">
						<FoodGrid />
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

				<div className="fixed bottom-6 right-6 md:hidden">
					<Button className="h-14 w-14 rounded-full shadow-lg">
						<span className="sr-only">Share Your Food</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="lucide lucide-plus"
						>
							<path d="M5 12h14" />
							<path d="M12 5v14" />
						</svg>
					</Button>
				</div>
			</main>
		</div>
	);
}