import { FoodCard } from '@/components/FoodCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
        const fetchPosts = async () => {
            if (filterType === 'nearby' && !userLocation) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const { data, error } = await supabase
                .from('barter_posts')
                .select(`
                    *,
                    profiles (
                        username
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                setError(error.message);
            } else {
                let filtered = data;

                // Filter out user's own posts
                if (userId) {
                    filtered = filtered.filter((post) => post.user_id !== userId);
                }

                // Apply type filter
                if (filterType !== 'all' && filterType !== 'nearby') {
                    filtered = filtered.filter((post) => post.type === filterType);
                }

                // Apply nearby filter
                if (filterType === 'nearby' && userLocation) {
                    filtered = filtered
                        .filter((post) => post.latitude && post.longitude)
                        .map((post) => ({
                            ...post,
                            distance: calculateDistance(
                                userLocation.latitude,
                                userLocation.longitude,
                                post.latitude,
                                post.longitude
                            )
                        }))
                        .filter((post) => post.distance <= 5) // 5 miles radius
                        .sort((a, b) => a.distance - b.distance);
                }

                setPosts(filtered);
            }
            setLoading(false);
        };

        fetchPosts();
    }, [userId, userLocation, filterType]);

    // Haversine formula to calculate distance between two points in miles
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 3958.8; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

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