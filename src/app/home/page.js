'use client';

import Navbar from '../../components/Navbar';

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="min-h-screen flex flex-col items-center justify-center p-24">
				<div className="text-center">
					<h1 className="text-4xl font-bold mb-6 text-blue-600">
						Your Fridge Dashboard
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						Manage your fridge contents and share with friends
					</p>
					<div className="space-x-4">
						<button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
							Add Item
						</button>
						<button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-300">
							View Friends
						</button>
					</div>
				</div>
			</main>
		</>
	);
}
