'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { MapPin, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import BarterRequestModal from './BarterRequestModal';
import { supabase } from '@/lib/supabase';

export function FoodCard({ item }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imageUrl, setImageUrl] = useState(null);

	useEffect(() => {
		if (item.image_url) {
			const { data } = supabase.storage
				.from('barter-images')
				.getPublicUrl(item.image_url);
			setImageUrl(data.publicUrl);
		}
	}, [item.image_url]);
	console.log(item);

	return (
		<>
			<Card className="overflow-hidden transition-all hover:shadow-md">
				<div className="aspect-square relative overflow-hidden">
					<Image
						src={imageUrl || '/placeholder.svg'}
						alt={item.name}
						fill
						className="object-cover transition-transform hover:scale-105"
					/>
					<Badge className="absolute top-3 right-3 bg-green-600">
						{item.category}
					</Badge>
				</div>

				<CardHeader className="p-4 pb-0">
					<div className="flex justify-between items-start">
						<h3 className="font-semibold text-lg">{item.name}</h3>
					</div>
					<div className="flex items-center text-sm text-muted-foreground mt-1">
						<MapPin className="h-3 w-3 mr-1" />
						<span>{item.distance}</span>
					</div>
				</CardHeader>

				<CardContent className="p-4 pt-2">
					<p className="text-sm text-muted-foreground line-clamp-2">
						{item.description}
					</p>
					<p className="text-sm mt-2 font-medium">
					From: {item.profiles?.username || 'Unknown'}
					</p>

				</CardContent>

				<CardFooter className="p-4 pt-0 flex gap-2">
					<Button
						className="w-full bg-green-600 hover:bg-green-700"
						onClick={() => setIsModalOpen(true)}
					>
						Barter
					</Button>
					<Button variant="outline" size="icon">
						<MessageCircle className="h-4 w-4" />
						<span className="sr-only">Message</span>
					</Button>
				</CardFooter>
			</Card>

			<BarterRequestModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				post={item}
			/>
		</>
	);
}
