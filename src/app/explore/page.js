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
		label: 'Post',
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

			{/* Sidebar (desktop) */}
			<aside className="hidden md:flex fixed right-8 top-32 flex-col items-center gap-6 z-20">
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

			{/* Top Navbar (mobile) */}
			<nav
				className="flex md:hidden fixed top-0 left-0 w-full bg-white border-b-4 border-black z-30 flex-row justify-center items-center gap-2 py-2 shadow-[0_4px_0px_0px_rgba(0,0,0,1)]"
				style={{ imageRendering: 'pixelated' }}
			>
				{sidebarButtons.map((btn) => (
					<a
						key={btn.label}
						href={btn.href}
						className="flex flex-col items-center mx-2"
					>
						<PixelButton src={btn.img} alt={btn.label} width={40} height={40} />
						<span
							className="text-black font-bold text-xs mt-0.5"
							style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
						>
							{btn.label}
						</span>
					</a>
				))}
			</nav>

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
						<FoodGrid />
					</TabsContent>
					<TabsContent value="all" className="mt-0">
						<FoodGridAll />
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}
