'use client';

import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import ItemGrid from '@/components/ItemGrid';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const tabButtons = [
	{ label: 'nearby', img: '/images/Nearbybutton.png' },
	{ label: 'furniture', img: '/images/Furniturebutton.png' },
	{ label: 'supplies', img: '/images/Suppliesbutton.png' },
	{ label: 'other', img: '/images/Otherbutton.png' },
	{ label: 'all', img: '/images/Allbutton.png' },
];

export default function Explore() {
	const [activeTab, setActiveTab] = useState('nearby');

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
				<Tabs defaultValue="nearby" className="w-full" onValueChange={setActiveTab}>
					<TabsList className="flex flex-row flex-wrap justify-center gap-2 mb-8 bg-transparent border-none shadow-none">
						{tabButtons.map((tab) => (
							<TabsTrigger
								key={tab.label}
								value={tab.label}
								className="group px-4 py-2 rounded-lg border-4 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all focus:ring-0 focus:outline-none data-[state=active]:translate-y-1 data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-32 text-center"
								style={{
									fontFamily: 'monospace',
									letterSpacing: '1px',
									backgroundColor: activeTab === tab.label ? '#A86523' : '#FCEFCB',
									color: activeTab === tab.label ? 'white' : 'black',
								}}
							>
								{tab.label}
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
