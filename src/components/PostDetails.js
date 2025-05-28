'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { processPostImage } from '@/utils/imageUtils';

export default function PostDetails({ post, showPrice = false, showDeadline = false }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageError, setImageError] = useState(false);

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

    return (
        <div className="mb-6 p-4 bg-gray-50 border-4 border-black rounded-lg">
            <h3
                className="text-xl font-bold mb-2 uppercase"
                style={{ fontFamily: 'monospace' }}
            >
                Post Details
            </h3>
            <div className="space-y-2">
                <div className="flex items-start gap-4">
                    {post?.image_url && !imageError && (
                        <div className="relative w-32 h-32 flex-shrink-0 border-4 border-black">
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
                        <div className="w-32 h-32 flex-shrink-0 border-4 border-black bg-gray-100 flex items-center justify-center">
                            <p className="text-xs text-gray-500">Image not available</p>
                        </div>
                    )}
                    <div>
                        <p
                            className="font-bold text-lg"
                            style={{ fontFamily: 'monospace' }}
                        >
                            {post.name}
                        </p>
                        <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: 'monospace' }}
                        >
                            Posted by: {post.profiles?.username || 'Unknown'}
                        </p>
                        <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: 'monospace' }}
                        >
                            Type: {post.type}
                        </p>
                        {showPrice && (
                            <p
                                className="text-sm text-gray-600"
                                style={{ fontFamily: 'monospace' }}
                            >
                                Price: ${post.price ? parseFloat(post.price).toFixed(2) : 'N/A'}
                            </p>
                        )}
                        {showDeadline && (
                            <p
                                className="text-sm text-gray-600"
                                style={{ fontFamily: 'monospace' }}
                            >
                                Deadline: {new Date(post.deadline).toLocaleDateString()}
                            </p>
                        )}
                        <p className="text-sm mt-2" style={{ fontFamily: 'monospace' }}>
                            {post.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 