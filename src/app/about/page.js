'use client';

import Navbar from '../../components/Navbar';

export default function About() {
	return (
		<>
			<Navbar />
			<main className="min-h-screen flex flex-col items-center justify-center p-24">
				<div className="text-center">
					<h1 className="text-4xl font-bold mb-6 text-blue-600">
						About Fridge Friends
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						Fridge Friends is a revolutionary app that helps you manage and
						share your fridge contents with friends and family.
					</p>
					<p className="text-lg text-gray-600">
						Never wonder what's in your fridge again, and easily coordinate
						grocery shopping with your roommates!
					</p>
				</div>
			</main>
		</>
	);
}
