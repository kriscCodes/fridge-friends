'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setIsAuthenticated(!!user);
		};
		checkAuth();
		// Listen for auth changes
		const { data: listener } = supabase.auth.onAuthStateChange(() => {
			checkAuth();
		});
		return () => {
			listener?.subscription.unsubscribe();
		};
	}, []);

	const buttonClassNames = "px-4 py-2 rounded-lg border-2 border-black font-bold uppercase hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all w-32 text-center";
	const buttonStyle = { fontFamily: 'monospace', boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' };

	return (
		<nav
			className="w-full flex items-center justify-between py-3 px-6 border-b-4 border-black relative z-50"
			style={{
				backgroundColor: '#8B4513',
				imageRendering: 'pixelated',
				boxShadow: '0 4px 0 rgba(0,0,0,0.5)',
			}}
		>
			<button
				onClick={() => router.push('/')}
				className="font-bold text-2xl text-white bg-transparent border-none p-0 m-0 cursor-pointer"
				style={{
					fontFamily: 'monospace',
					textShadow: '2px 2px 0px #000',
					letterSpacing: '1px',
				}}
				aria-label="Go to Home"
			>
				InFRIENDtory
			</button>

			{/* Mobile menu button */}
			<button
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				className="md:hidden text-white p-2"
				aria-label="Toggle menu"
			>
				{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Navigation buttons - hidden on mobile unless menu is open */}
			<div
				className={`${
					isMenuOpen ? 'flex' : 'hidden'
				} md:flex flex-col md:flex-row absolute md:relative top-full md:top-auto left-0 right-0 md:left-auto md:right-auto bg-[#8B4513] md:bg-transparent p-4 md:p-0 border-b-4 md:border-b-0 border-black md:space-x-3 space-y-3 md:space-y-0 z-[9999]`}
			>
				<button
					onClick={() => {
						router.push('/explore');
						setIsMenuOpen(false);
						router.refresh();
					}}
					className={`bg-yellow-600 text-white ${buttonClassNames}`}
					style={buttonStyle}
				>
					Explore
				</button>

				{isAuthenticated && (
					<button
						onClick={() => {
							router.push('/requests');
							setIsMenuOpen(false);
							router.refresh();
						}}
						className={`text-black ${buttonClassNames}`}
						style={{ ...buttonStyle, backgroundColor: '#ECE852' }}
					>
						Offers
					</button>
				)}

				{isAuthenticated && (
					<button
						onClick={() => { router.push('/ongoing'); setIsMenuOpen(false); router.refresh(); }}
						className={`text-white ${buttonClassNames}`}
						style={{ ...buttonStyle, backgroundColor: '#3E7B27' }}
					>
						Ongoing
					</button>
				)}

				{isAuthenticated && (
					<button
						onClick={() => { router.push('/completed'); setIsMenuOpen(false); router.refresh(); }}
						className={`bg-green-800 text-white ${buttonClassNames}`}
						style={buttonStyle}
					>
						Completed
					</button>
				)}

				{isAuthenticated && (
					<button
						onClick={() => {
							router.push('/profile');
							setIsMenuOpen(false);
							router.refresh();
						}}
						className={`bg-purple-600 text-white ${buttonClassNames}`}
						style={buttonStyle}
					>
						Profile
					</button>
				)}
			</div>
		</nav>
	);
}
