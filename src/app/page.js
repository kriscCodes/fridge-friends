'use client';

import Navbar from '../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import { Jersey_10 } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { PixelButton } from '../components/PixelButton';

const jersey10 = Jersey_10({
	weight: '400',
	subsets: ['latin'],
});

export default function Home() {
	const router = useRouter();
	return (
		<div className="relative w-full min-h-screen overflow-hidden bg-black">
			{/* Pixel-art city background */}
			<Image
				src="/images/UserProfilebg.jpeg"
				alt="Background"
				fill
				priority
				className="object-cover w-full h-full absolute inset-0 z-0"
				style={{ imageRendering: 'pixelated' }}
			/>

			{/* SIGN UP and LOGIN buttons top right */}
			<div className="absolute top-6 right-6 z-30 flex flex-row gap-4 items-center">
				<a href="/login">
					<PixelButton
						src="/images/LOGINButton.png"
						alt="Log In"
						width={120}
						height={48}
					/>
				</a>

				<Link href="/register">
					<PixelButton
						src="/images/SIGNUPButton.png"
						alt="Sign Up"
						width={120}
						height={48}
					/>
				</Link>
			</div>

			{/* Centered content */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
				<div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-4">
					<img
						src="/images/FavIcon.png"
						alt="Avocado"
						width={300}
						height={300}
						className="w-[120px] h-[120px] md:w-[180px] md:h-[180px]"
						style={{ imageRendering: 'pixelated' }}
					/>
					<h1
						className={`${jersey10.className} text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-center leading-tight md:leading-none`}
						style={{
							WebkitTextStroke: '4px #000',
							textShadow: '4px 4px 0 #000',
							letterSpacing: '2px',
							imageRendering: 'pixelated',
							fontFamily: 'monospace',
						}}
					>
						inFRIEND
						<br className="hidden md:block" />
						tory
					</h1>
					<img
						src="/images/FavIcon.png"
						alt="Apple"
						width={500}
						height={500}
						className="w-[120px] h-[120px] md:w-[180px] md:h-[180px]"
						style={{ imageRendering: 'pixelated' }}
					/>
				</div>
				<Link href="/about">
					<Image
						src="/images/Learnmorebutton.png"
						alt="Learn More"
						width={220}
						height={80}
						className="mt-2 w-[180px] md:w-[220px]"
						style={{ imageRendering: 'pixelated' }}
					/>
				</Link>
			</div>
		</div>
	);
}
