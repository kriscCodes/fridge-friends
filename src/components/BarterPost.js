'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadPostImage } from '@/utils/imageUtils';
import { POST_STATUS } from '@/constants/requestConstants';

export default function BarterPostModal({ isOpen, onClose, onPostCreated }) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [type, setType] = useState('');
	const [deadline, setDeadline] = useState('');
	const [price, setPrice] = useState('');
	const [imageFile, setImageFile] = useState(null);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);

	const handleDelete = async (postId) => {
		try {
			const { error } = await supabase
				.from('barter_posts')
				.delete()
				.eq('id', postId);

			if (error) {
				setError('Failed to delete post');
				return;
			}

			// Refresh the page after successful deletion
			router.refresh();
		} catch (error) {
			setError('An unexpected error occurred while deleting');
		}
	};

	// Get location when modal opens
	useEffect(() => {
		if (isOpen && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					setLatitude(pos.coords.latitude);
					setLongitude(pos.coords.longitude);
				},
				(err) => {
					console.error('Location error:', err);
				}
			);
		}
	}, [isOpen]);

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			setImageFile(file);
		} catch (error) {
			console.error('Error processing image:', error);
			setError('Failed to process image. Please try a different file.');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setIsLoading(true);

		try {
			const { data: { user }, error: userError } = await supabase.auth.getUser();

			if (userError || !user) {
				setError('You must be logged in to post.');
				return;
			}

			let imageUrl = null;
			if (imageFile) {
				imageUrl = await uploadPostImage(imageFile);
			}

			const { error: insertError } = await supabase
				.from('barter_posts')
				.insert({
					user_id: user.id,
					name: title,
					description,
					type,
					deadline,
					price: price ? parseFloat(price) : null,
					image_url: imageUrl,
					latitude,
					longitude,
					status: POST_STATUS.ACTIVE
				});

			if (insertError) throw insertError;

			// Clear form fields
			setTitle('');
			setDescription('');
			setType('food');
			setDeadline('');
			setPrice('');
			setImageFile(null);
			setLatitude(null);
			setLongitude(null);

			// Show success message and close modal
			setSuccess('Post created successfully!');
			setTimeout(() => {
				if (onPostCreated) onPostCreated();
				onClose();
			}, 1500);
		} catch (err) {
			setError(err.message);
			console.error('Post creation error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	// Reset form when modal closes
	useEffect(() => {
		if (!isOpen) {
			setTitle('');
			setDescription('');
			setType('');
			setDeadline('');
			setPrice('');
			setImageFile(null);
			setError(null);
			setSuccess(null);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 flex items-center justify-center z-50 p-4"
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
		>
			<div
				className="relative w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto"
				style={{
					imageRendering: 'pixelated',
					border: '8px solid #000',
					borderRadius: '16px',
					boxShadow:
						'0 0 0 4px #fff, 0 0 0 8px #000, 0 10px 15px rgba(0,0,0,0.5)',
					backgroundColor: '#FFF8E7',
				}}
			>
				{isLoading && (
					<div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center">
						<div className="text-center">
							<div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
							<p
								className="text-white text-xl font-bold"
								style={{ fontFamily: 'monospace' }}
							>
								Uploading...
							</p>
						</div>
					</div>
				)}
				<div className="relative z-10 p-8">
					<h2
						className="text-4xl font-bold mb-8 text-center text-black uppercase"
						style={{
							textShadow: '2px 2px 0 #fff',
							fontFamily: 'monospace',
							letterSpacing: '2px',
						}}
					>
						Trading
					</h2>

					{/* 🔥 FLEX CONTAINER: split left/right */}
					<div className="flex flex-col md:flex-row gap-8">
						{/* LEFT: FORM */}
						<form onSubmit={handleSubmit} className="flex-1 space-y-6">
							{/* name, type, description, deadline */}
							<div>
								<label
									className="block text-xl font-bold mb-2 text-black"
									style={{
										textShadow: '1px 1px 0 #fff',
										fontFamily: 'monospace',
									}}
								>
									Name :
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="w-full p-3 rounded-lg border-4 border-black bg-white"
									required
									style={{ fontFamily: 'monospace' }}
								/>
							</div>
							<div>
								<label
									className="block text-xl font-bold mb-2 text-black"
									style={{
										textShadow: '1px 1px 0 #fff',
										fontFamily: 'monospace',
									}}
								>
									Type :
								</label>
								<select
									value={type}
									onChange={(e) => setType(e.target.value)}
									className="w-full p-3 rounded-lg border-4 border-black bg-white"
									required
									style={{ fontFamily: 'monospace' }}
								>
									<option value="" disabled>
										Select type
									</option>
									<option value="clothes">Clothes</option>
									<option value="furniture">Furniture</option>
									<option value="supplies">Supplies</option>
									<option value="other">Other</option>
								</select>
							</div>
							<div>
								<label
									className="block text-xl font-bold mb-2 text-black"
									style={{
										textShadow: '1px 1px 0 #fff',
										fontFamily: 'monospace',
									}}
								>
									Description :
								</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="w-full p-3 rounded-lg border-4 border-black bg-white"
									rows="3"
									required
									style={{ fontFamily: 'monospace' }}
								/>
							</div>
							<div>
								<label
									className="block text-xl font-bold mb-2 text-black"
									style={{
										textShadow: '1px 1px 0 #fff',
										fontFamily: 'monospace',
									}}
								>
									Exp. Date :
								</label>
								<input
									type="date"
									value={deadline}
									onChange={(e) => setDeadline(e.target.value)}
									className="w-full p-3 rounded-lg border-4 border-black bg-white"
									required
									style={{ fontFamily: 'monospace' }}
								/>
							</div>
							<div>
								<label
									className="block text-xl font-bold mb-2 text-black"
									style={{
										textShadow: '1px 1px 0 #fff',
										fontFamily: 'monospace',
									}}
								>
									Price (optional) :
								</label>
								<input
									type="number"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									className="w-full p-3 rounded-lg border-4 border-black bg-white"
									style={{ fontFamily: 'monospace' }}
								/>
							</div>

							{error && (
								<p
									className="text-red-600 text-sm bg-white p-2 rounded border-2 border-black"
									style={{ fontFamily: 'monospace' }}
								>
									{error}
								</p>
							)}
							{success && (
								<p
									className="text-green-600 text-sm bg-white p-2 rounded border-2 border-black"
									style={{ fontFamily: 'monospace' }}
								>
									{success}
								</p>
							)}

							{/* IMAGE UPLOAD */}
							<div className="flex-shrink-0 flex items-center justify-center mt-6">
								<div className="w-full md:w-64 h-64 bg-white border-4 border-black relative overflow-hidden rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
									{imageFile ? (
										<img
											src={URL.createObjectURL(imageFile) || '/placeholder.svg'}
											alt="Preview"
											className="w-full h-full object-cover"
											style={{ imageRendering: 'pixelated' }}
										/>
									) : (
										<span
											className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold"
											style={{ fontFamily: 'monospace' }}
										>
											Upload
										</span>
									)}
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="absolute inset-0 opacity-0 cursor-pointer"
									/>
								</div>
							</div>

							<div className="flex justify-end space-x-3 pt-4">
								<button
									type="button"
									onClick={onClose}
									className="px-4 py-2 bg-red-500 text-white rounded-lg border-4 border-black font-bold hover:bg-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
									style={{ fontFamily: 'monospace' }}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg border-4 border-black text-xl uppercase hover:bg-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
									style={{
										textShadow: '1px 1px 0 #000',
										fontFamily: 'monospace',
										letterSpacing: '1px',
									}}
								>
									UPLOAD
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
