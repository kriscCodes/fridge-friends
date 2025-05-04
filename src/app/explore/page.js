'use client';

import Image from 'next/image';
import FoodGrid from '@/components/FoodGrid';
import FoodGridAll from '@/components/FoodGridAll';
import { PixelButton } from '@/components/PixelButton';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabButtons = [
	{ label: 'all', img: '/images/Allbutton.png' },
	{ label: 'fruits', img: '/images/Fruitsbutton.png' },
	{ label: 'vegetables', img: '/images/Vegetablesbutton.png' },
	{ label: 'grains', img: '/images/Grainsbutton.png' },
	{ label: 'dairy', img: '/images/Dairybutton.png' },
	{ label: 'protein', img: '/images/Proteinbutton.png' },
];

const sidebarButtons = [
	{
		label: 'Create Listing',
		img: '/images/PlusIcon_Centered.png',
		href: '/profile',
	},
	{ label: 'Profile', img: '/images/Profilebutton.png', href: '/profile' },
	{ label: 'Home', img: '/images/Homebutton.png', href: '/' },
];

export default function Explore() {
	return (
		
		<div className="relative min-h-screen w-full overflow-x-hidden">
			{/* Background */}
			<Image
				src="/images/Farm.png"
				alt="Farm Background"
				fill
				className="object-cover -z-10"
				priority
			/>

			{/* Sidebar */}
			<aside className="fixed right-8 top-32 flex flex-col items-center gap-6 z-20">
				{sidebarButtons.map((btn) => (
					<a
					key={btn.label}
					href={btn.href}
					className="flex flex-col items-center"
					>
					<PixelButton
						src={btn.img}
						alt={btn.label}
						width={100}
						height={100}
					/>
					<span className="text-white font-bold text-lg drop-shadow-md mt-1">
						{btn.label}
					</span>
					</a>
				))}
				</aside>


			{/* Main Content with Tabs */}
			<main className="relative z-10 max-w-6xl mx-auto pt-8 pb-16 px-4">
				<Tabs defaultValue="all" className="w-full">
				

					<TabsContent value="all" className="mt-0">
						<FoodGrid />
					</TabsContent>
					<TabsContent value="all" className="mt-0">
						<FoodGridAll/>
					</TabsContent>
					
				</Tabs>
			</main>
		</div>
	);
}
