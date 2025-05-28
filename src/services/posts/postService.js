import { supabase } from '@/lib/supabase';
import { processPostImage } from '@/utils/imageUtils';
import { POST_STATUS } from '@/constants/requestConstants';

export const fetchActivePosts = async (userId = null, filterType = 'all', userLocation = null) => {
    const query = supabase
        .from('barter_posts')
        .select(`
            *,
            profiles (
                username
            )
        `)
        .eq('status', POST_STATUS.ACTIVE)
        .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

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

    // Process image URLs
    const processedPosts = await Promise.all(
        filtered.map(async (post) => ({
            ...post,
            image_url: await processPostImage(post.image_url)
        }))
    );

    return processedPosts;
};

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

export const deletePost = async (postId) => {
    const { error } = await supabase
        .from('barter_posts')
        .delete()
        .eq('post_id', postId);
    
    if (error) throw error;
};

export const updatePostStatus = async (postId, status) => {
    const { error } = await supabase
        .from('barter_posts')
        .update({ status })
        .eq('post_id', postId);
    
    if (error) throw error;
}; 