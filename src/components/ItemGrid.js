'use client';

import { FoodCard } from '@/components/FoodCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchActivePosts } from '@/services/posts/postService';

export default function ItemGrid({ filterType = 'all' }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        };
        fetchUser();

        // Get user's current location if needed for nearby filter
        if (filterType === 'nearby' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setError('Please enable location access to see nearby items.');
                }
            );
        }
    }, [filterType]);

    useEffect(() => {
        const loadPosts = async () => {
            if (filterType === 'nearby' && !userLocation) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const fetchedPosts = await fetchActivePosts(userId, filterType, userLocation);
                setPosts(fetchedPosts);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, [userId, userLocation, filterType]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (filterType === 'nearby' && !userLocation) return <div>Please enable location access to see nearby items.</div>;
    if (!posts.length) {
        if (filterType === 'nearby') return <div>No items found within 5 miles.</div>;
        if (filterType === 'all') return <div>No items found.</div>;
        return <div>No {filterType} items found.</div>;
    }

    const getHeading = () => {
        switch (filterType) {
            case 'all':
                return 'ALL BARTER:';
            case 'nearby':
                return 'NEARBY BARTER:';
            default:
                return `${filterType.toUpperCase()}:`;
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-4 text-white uppercase" style={{ fontFamily: 'monospace', textShadow: '2px 2px 0px #000' }}>
                {getHeading()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((item) => (
                    <FoodCard key={item.id || item.post_id} item={item} />
                ))}
            </div>
        </>
    );
} 