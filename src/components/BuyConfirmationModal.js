'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createPortal } from 'react-dom';

export default function BuyConfirmationModal({ isOpen, onClose, post }) {
    const [offerName, setOfferName] = useState('');
    const [offerDescription, setOfferDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postImageUrl, setPostImageUrl] = useState(null);
    const router = useRouter();

    useState(() => {
        if (post?.image_url) {
            const { data } = supabase.storage
                .from('barter-images')
                .getPublicUrl(post.image_url);
            setPostImageUrl(data.publicUrl);
        }
    }, [post?.image_url]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Get current user
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();
            if (userError) throw userError;

            // Create buy request
            const { error: requestError } = await supabase
                .from('barter_requests')
                .insert({
                    post_id: post.post_id,
                    from_user_id: user.id,
                    to_user_id: post.user_id,
                    offer_name: offerName || 'Buy',
                    offer_description: offerDescription,
                    status: 'pending',
                    trade_type: 'buy'
                });

            if (requestError) throw requestError;

            // Close modal and refresh
            onClose();
            router.refresh();
        } catch (err) {
            setError(err.message);
            console.error('Buy request error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
            <div className="bg-white border-4 border-black p-6 max-w-2xl w-full mx-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2
                    className="text-2xl font-bold mb-4 uppercase"
                    style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
                >
                    Confirm Purchase
                </h2>

                {/* Post Details Section */}
                <div className="mb-6 p-4 bg-gray-50 border-4 border-black rounded-lg">
                    <h3
                        className="text-xl font-bold mb-2 uppercase"
                        style={{ fontFamily: 'monospace' }}
                    >
                        Item Details
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-start gap-4">
                            {postImageUrl && (
                                <div className="relative w-32 h-32 flex-shrink-0 border-4 border-black">
                                    <Image
                                        src={postImageUrl}
                                        alt={post.name}
                                        fill
                                        className="object-cover"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                </div>
                            )}
                            <div className="flex-1">
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
                                <p
                                    className="text-sm text-gray-600"
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    Deadline: {new Date(post.deadline).toLocaleDateString()}
                                </p>
                                <p className="text-sm mt-2" style={{ fontFamily: 'monospace' }}>
                                    {post.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            className="block text-sm font-bold mb-1 uppercase"
                            style={{ fontFamily: 'monospace' }}
                        >
                            Title (Optional)
                        </label>
                        <Input
                            type="text"
                            value={offerName}
                            onChange={(e) => setOfferName(e.target.value)}
                            className="w-full"
                            style={{ fontFamily: 'monospace' }}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label
                            className="block text-sm font-bold mb-1 uppercase"
                            style={{ fontFamily: 'monospace' }}
                        >
                            Message to Seller (Optional)
                        </label>
                        <Textarea
                            value={offerDescription}
                            onChange={(e) => setOfferDescription(e.target.value)}
                            className="w-full"
                            style={{ fontFamily: 'monospace' }}
                            placeholder="Add a message for the seller"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-red-600 text-white font-mono font-bold uppercase border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                            style={{ borderRadius: 0, letterSpacing: '0.08em' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white font-mono font-bold uppercase border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ borderRadius: 0, letterSpacing: '0.08em' }}
                        >
                            {loading ? 'Processing...' : 'Confirm Purchase'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (typeof window !== 'undefined') {
        return createPortal(modalContent, document.body);
    }
    return null;
} 