'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function PaymentCancelled() {
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="bg-white border-4 border-black rounded-xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-md w-full text-center">
				<div className="mb-6">
					<Image
						src="/images/error.png"
						alt="Error"
						width={100}
						height={100}
						className="mx-auto"
						style={{ imageRendering: 'pixelated' }}
					/>
				</div>

				<h1
					className="text-3xl font-bold mb-4 font-mono"
					style={{ textShadow: '2px 2px 0 #000' }}
				>
					Payment Cancelled
				</h1>

				<p className="text-gray-700 mb-6 font-mono">
					Your payment was cancelled. No charges were made to your account.
				</p>

				<div className="space-y-4">
					<Link
						href="/explore"
						className="inline-block w-full px-6 py-3 bg-blue-500 text-white font-bold rounded-lg border-4 border-blue-900 hover:bg-blue-600 active:bg-blue-700 transition-colors"
						style={{
							fontFamily: 'monospace',
							imageRendering: 'pixelated',
							textShadow: '2px 2px 0 #000',
						}}
					>
						Try Again
					</Link>

					<Link
						href="/"
						className="inline-block w-full px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg border-4 border-gray-400 hover:bg-gray-300 active:bg-gray-400 transition-colors"
						style={{
							fontFamily: 'monospace',
							imageRendering: 'pixelated',
						}}
					>
						Return Home
					</Link>
				</div>
			</div>
		</div>
	);
}
