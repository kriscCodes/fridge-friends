'use client';

import Navbar from '../../components/Navbar';

export default function About() {
	return (
		<>
			<Navbar />
			<main className="min-h-screen flex flex-col items-center justify-center p-24">
				<div className="text-center">
					<h1 className="text-4xl font-bold mb-6 text-blue-600">
						About inFRIENDtory
					</h1>
					<p className="text-xl text-gray-600 mb-8">
						inFRIENDtory is an app that lets CUNY students trade, sell, or
						donate items like furniture, clothes, and supplies within a trusted
						campus community.
					</p>
					<p className="text-lg text-gray-600 mb-8">
						Find what you need, give what you don&apos;t—trade, sell, or donate
						with fellow CUNY students near you!
					</p>
					<div className="w-full flex justify-center">
						<iframe
							className="w-[360px] h-[640px] rounded-lg shadow-lg"
							src="https://www.youtube.com/embed/e7hbfb9_fp8"
							title="CampusCart Demo"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						></iframe>
					</div>
				</div>
			</main>
		</>
	);
}
