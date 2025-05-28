import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { processPostImage, processOfferImage } from '@/utils/imageUtils';
import { useState, useEffect } from 'react';

export default function BarterCard({ 
    barter, 
    currentUser, 
    onMarkComplete, 
    isSelected, 
    onClick,
    showStatus = true,
    showActions = true 
}) {
    const [postImageUrl, setPostImageUrl] = useState(null);
    const [offerImageUrl, setOfferImageUrl] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const loadImages = async () => {
            try {
                if (barter.barter_posts?.image_url) {
                    const url = await processPostImage(barter.barter_posts.image_url);
                    setPostImageUrl(url);
                }
                if (barter.offer_image) {
                    const url = await processOfferImage(barter.offer_image);
                    setOfferImageUrl(url);
                }
            } catch (error) {
                console.error('Error loading images:', error);
                setImageError(true);
            }
        };
        loadImages();
    }, [barter]);

    const tradingPartner = barter.from_user_id === currentUser?.id 
        ? barter.to_user?.username 
        : barter.from_user?.username;

    return (
        <div
            className={`bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col gap-2 items-stretch ${
                onClick ? 'cursor-pointer' : ''
            } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            style={{
                imageRendering: 'pixelated',
                minWidth: 280,
                maxWidth: 340,
            }}
            onClick={onClick}
        >
            <div className="bg-gray-50 p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold">
                            {barter.barter_posts?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Trading with: {tradingPartner}
                        </p>
                    </div>
                    {showStatus && (
                        barter.status === 'accepted' && showActions ? (
                            barter.requester_status || barter.poster_status ? (
                                <span className="bg-yellow-500 text-white px-4 py-2 rounded-lg border-2 border-black font-bold uppercase">
                                    Completion Pending
                                </span>
                            ) : (
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Mark Complete button clicked in BarterCard');
                                        if (onMarkComplete) {
                                            console.log('Calling onMarkComplete');
                                            onMarkComplete(barter);
                                        }
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg border-2 border-black font-bold uppercase hover:bg-green-700 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    Mark Complete
                                </Button>
                            )
                        ) : (
                            <span className={`${
                                barter.status === 'completed' 
                                    ? 'bg-green-500' 
                                    : 'bg-gray-500'
                            } text-white px-4 py-2 rounded-lg border-2 border-black font-bold uppercase`}>
                                {barter.status}
                            </span>
                        )
                    )}
                </div>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium mb-2">Their Offer:</h4>
                        <p className="text-sm">{barter.offer_name}</p>
                        {offerImageUrl && !imageError ? (
                            <div className="mt-2 relative aspect-square w-24">
                                <Image
                                    src={offerImageUrl}
                                    alt={barter.offer_name}
                                    fill
                                    className="object-cover rounded"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </div>
                        ) : (
                            <div className="mt-2 relative aspect-square w-24 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500">No image</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Your Item:</h4>
                        <p className="text-sm">{barter.barter_posts?.name}</p>
                        {postImageUrl && !imageError ? (
                            <div className="mt-2 relative aspect-square w-24">
                                <Image
                                    src={postImageUrl}
                                    alt={barter.barter_posts?.name}
                                    fill
                                    className="object-cover rounded"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </div>
                        ) : (
                            <div className="mt-2 relative aspect-square w-24 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500">No image</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 