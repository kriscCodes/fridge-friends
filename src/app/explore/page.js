'use client';

import Image from 'next/image';
import ItemGrid from '@/components/FoodGrid';
import ItemGridAll from '@/components/FoodGridAll';
import { PixelButton } from '@/components/PixelButton';
import Navbar from '@/components/Navbar';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabButtons = [
	{ label: 'all', img: '/images/Allbutton.png' },
	// { label: 'fruits', img: '/images/Fruitsbutton.png' },
	// { label: 'vegetables', img: '/images/Vegetablesbutton.png' },
	// { label: 'grains', img: '/images/Grainsbutton.png' },
	// { label: 'dairy', img: '/images/Dairybutton.png' },
	// { label: 'protein', img: '/images/Proteinbutton.png' },
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

			{/* Navbar */}
			<Navbar />

			{/* Main Content with Tabs */}
			<main className="relative z-10 max-w-6xl mx-auto pt-24 md:pt-8 pb-16 px-4">
				<Tabs defaultValue="all" className="w-full">
					<TabsList className="flex flex-row flex-wrap justify-center gap-2 mb-8 bg-transparent border-none shadow-none">
						{tabButtons.map((tab) => (
							<TabsTrigger
								key={tab.label}
								value={tab.label}
								className="group bg-transparent border-none shadow-none p-0 focus:ring-0 focus:outline-none transition-transform data-[state=active]:bg-transparent"
								style={{ background: 'transparent' }}
							>
								<span className="inline-flex items-center justify-center w-[120px] h-[40px] bg-white/0 rounded-lg overflow-hidden">
									<Image
										src={tab.img}
										alt={tab.label}
										width={120}
										height={40}
										className="object-contain w-full h-full transition-transform group-data-[state=active]:scale-110 group-data-[state=active]:drop-shadow-lg bg-transparent"
										style={{ background: 'transparent' }}
									/>
								</span>
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value="all" className="mt-0">
						<ItemGrid />
					</TabsContent>
					<TabsContent value="all" className="mt-0">
						<ItemGridAll />
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
