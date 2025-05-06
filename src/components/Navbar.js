'use client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
	const router = useRouter();

	return (
		<nav
			className="w-full flex items-center justify-between py-3 px-6 border-b-4 border-black"
			style={{
				backgroundColor: '#8B4513',
				imageRendering: 'pixelated',
				boxShadow: '0 4px 0 rgba(0,0,0,0.5)',
			}}
		>
			<div
				className="font-bold text-2xl text-white"
				style={{
					fontFamily: 'monospace',
					textShadow: '2px 2px 0px #000',
					letterSpacing: '1px',
				}}
			>
				CampusCart
			</div>

			<div className="flex space-x-3">
				<button
					onClick={() => router.push('/explore')}
					className="bg-yellow-600 text-white px-4 py-2 rounded-lg border-2 border-black font-bold uppercase hover:bg-yellow-700 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
					style={{ fontFamily: 'monospace' }}
				>
					Explore
				</button>

				<button
					onClick={() => router.push('/requests')}
					className="bg-green-600 text-white px-4 py-2 rounded-lg border-2 border-black font-bold uppercase hover:bg-green-700 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
					style={{ fontFamily: 'monospace' }}
				>
					Offers
				</button>

				<button
					onClick={() => router.push('/profile')}
					className="bg-purple-600 text-white px-4 py-2 rounded-lg border-2 border-black font-bold uppercase hover:bg-purple-700 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
					style={{ fontFamily: 'monospace' }}
				>
					Profile
				</button>
			</div>
		</nav>
	);
}
