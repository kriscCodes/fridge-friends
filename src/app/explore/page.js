'use client';

import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import ItemGrid from '@/components/ItemGrid';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PixelButton } from '@/components/PixelButton';

const tabButtons = [
	{ label: 'nearby', img: '/images/Nearbybutton.png' },
	{ label: 'furniture', img: '/images/Furniturebutton.png' },
	{ label: 'supplies', img: '/images/Suppliesbutton.png' },
	{ label: 'other', img: '/images/Otherbutton.png' },
	{ label: 'all', img: '/images/Allbutton.png' },
];

export default function Explore() {
	const [activeTab, setActiveTab] = useState('all');

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
				<Tabs
					defaultValue="all"
					className="w-full bg-transparent"
					onValueChange={setActiveTab}
				>
					<TabsList className="flex flex-row flex-wrap justify-center gap-2 mb-8 bg-transparent p-0 m-0 shadow-none border-none">
						{tabButtons.map((tab) => (
							<TabsTrigger
								key={tab.label}
								value={tab.label}
								className="p-0 border-none shadow-none bg-transparent data-[state=active]:bg-transparent"
							>
								<PixelButton
									onClick={() => setActiveTab(tab.label)}
									src={tab.img}
									alt={tab.label}
									width={100}
									height={40}
								/>
							</TabsTrigger>
						))}
					</TabsList>

					{tabButtons.map((tab) => (
						<TabsContent key={tab.label} value={tab.label} className="mt-0">
							<ItemGrid filterType={tab.label} />
						</TabsContent>
					))}
				</Tabs>
			</main>
		</div>
	);
}
