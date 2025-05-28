'use client';
import { Jersey_10 } from 'next/font/google';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import QRCodeGenerator from './QRCodeGenerator';
import { processPostImage } from '@/utils/imageUtils';

const jersey10 = Jersey_10({
	subsets: ['latin'],
	weight: '400',
	display: 'swap',
});

export default function UserBarterPost({ post, onDelete }) {
	const [imageUrl, setImageUrl] = useState(null);
	const [imageError, setImageError] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [mode, setMode] = useState(null);

	useEffect(() => {
		const loadImage = async () => {
			if (post?.image_url) {
				try {
					const url = await processPostImage(post.image_url);
					setImageUrl(url);
				} catch (error) {
					console.error('Error processing post image:', error);
					setImageError(true);
				}
			}
		};
		loadImage();
	}, [post?.image_url]);

	const handleDelete = async () => {
		const confirmed = confirm(
			`Are you sure you want to delete "${post.name}"?`
		);
		if (!confirmed) return;

		setIsDeleting(true);
		try {
			const { error } = await supabase
				.from('barter_posts')
				.delete()
				.eq('post_id', post.post_id);

			if (error) {
				alert('Failed to delete post: ' + error.message);
				console.error(error);
			} else {
				if (onDelete) onDelete(post.post_id);
				window.location.reload();
			}
		} catch (error) {
			alert('An error occurred while deleting the post');
			console.error(error);
		} finally {
			setIsDeleting(false);
		}
	};

	if (isDeleting) {
		return (
			<div className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center h-40">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
					<p className="text-sm font-bold" style={{ fontFamily: 'monospace' }}>
						Deleting...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-2"
			style={{ imageRendering: 'pixelated' }}
		>
			{post?.image_url && !imageError && (
				<div className="relative w-full h-40 overflow-hidden rounded-lg border-4 border-black">
					<Image
						src={imageUrl || '/placeholder.svg'}
						alt={post.name}
						fill
						className="object-cover"
						style={{ imageRendering: 'pixelated' }}
						onError={() => setImageError(true)}
					/>
				</div>
			)}
			{imageError && (
				<div className="w-full h-40 overflow-hidden rounded-lg border-4 border-black bg-gray-100 flex items-center justify-center">
					<p className="text-xs text-gray-500">Image not available</p>
				</div>
			)}

			<div>
				<div
					className={`text-2xl text-black ${jersey10.className} mb-1 uppercase`}
				>
					{post.name}
				</div>
				<p
					className="text-sm text-gray-700 line-clamp-2 font-bold"
					style={{ fontFamily: 'monospace' }}
				>
					{post.description}
				</p>
			</div>

			<div
				className="text-sm text-gray-700 mt-1 font-bold"
				style={{ fontFamily: 'monospace' }}
			>
				<p>
					<strong>Type:</strong> {post.type}
				</p>
				{/* <p>
					<strong>Barter:</strong> {post.barter_type}
				</p> */}
				<p>
					<strong>Status:</strong>{' '}
					{post.status}
				</p>
				{post.price && (
					<p>
						<strong>Price:</strong> ${post.price.toFixed(2)}
					</p>
				)}
			</div>

			{!mode && (
				<div style={{ marginTop: '0px' }}>
					<button
					onClick={() => setMode('generate')}
					className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold border-2 border-black hover:bg-red-700 transition"
					style={{ fontFamily: 'monospace' }}
					>
					     Complete Transaction   
					</button>
				</div>
			)}

			{mode === 'generate' && (
				<div>
					<button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold border-2 border-black hover:bg-red-700 transition" style={{ fontFamily: 'monospace'  }} >
						<QRCodeGenerator />
					</button>
					
					<button onClick={() => setMode(null)} className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold border-2 border-black hover:bg-red-700 transition" style={{ fontFamily: 'monospace'  }}>
						🔙 Back
					</button>
				</div>
			)}



			<button
				onClick={handleDelete}
				className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold border-2 border-black hover:bg-red-700 transition"
				style={{ fontFamily: 'monospace' }}
			>
				Delete Post
			</button>
		</div>
	);
}