'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ExploreNavbar() {
	return (
		<header className="bg-white shadow-sm">
			<div className="container mx-auto px-4 py-6">
				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<h1 className="text-2xl font-bold text-green-700">
								Fridge Friends
							</h1>
							<Link href="/profile">
								<Button variant="ghost" className="text-green-700">
									My Profile
								</Button>
							</Link>
						</div>
						<Button variant="outline" className="hidden sm:flex">
							Share Your Food
						</Button>
					</div>

					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search for produce, herbs, ingredients..."
							className="pl-10 bg-gray-50"
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
