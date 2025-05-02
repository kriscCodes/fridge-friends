'use client';

import Link from 'next/link';

export default function Navbar() {
	return (
		<nav className="w-full flex items-center justify-between py-4 px-8 bg-blue-600 text-white">
			<div className="font-bold text-xl">Fridge Friends</div>
			<div className="space-x-4">
				<Link href="/" className="hover:underline">
					Home
				</Link>
				<Link href="/home" className="hover:underline">
					Dashboard
				</Link>
				<Link href="/about" className="hover:underline">
					About
				</Link>
			</div>
		</nav>
	);
}
