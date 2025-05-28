'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const useRequests = () => {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                setError('Error fetching user: ' + userError.message);
                return;
            }
            setUserId(user.id);
        };

        fetchUser();
    }, []);

    const fetchRequests = async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            // --- Fetch Incoming Requests ---
            const { data: incomingData, error: incomingError } = await supabase
                .from('barter_requests')
                .select('*, post_id, from_user_id') // Select basic fields + foreign keys
                .eq('to_user_id', userId) // Where current user is the recipient
                .eq('status', 'pending') // Only include pending requests
                .order('created_at', { ascending: false });

            if (incomingError) throw incomingError;

            // Fetch related data for incoming requests (sender profile, post details)
            const processedIncoming = await Promise.all(incomingData.map(async (request) => {
                const { data: fromProfileData, error: fromProfileError } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', request.from_user_id)
                    .single();
                if (fromProfileError) console.error('Error fetching from_profile for incoming request:', fromProfileError);

                const { data: postData, error: postError } = await supabase
                    .from('barter_posts')
                    .select('*, profiles:user_id(username)') // Fetch post details + poster username
                    .eq('post_id', request.post_id)
                    .single();
                if (postError) console.error('Error fetching post for incoming request:', postError);

                 // Get public URL for offer image if it's a path (not a full URL)
                let offerImageUrl = request.offer_image;
                if (offerImageUrl && !offerImageUrl.startsWith('http')) {
                     const { data } = supabase.storage
                         .from('offer-images') // Assuming 'offer-images' bucket
                         .getPublicUrl(offerImageUrl);
                     offerImageUrl = data.publicUrl;
                }

                // Get public URL for post image if it exists
                let postImageUrl = null; // Initialize postImageUrl
                if (postData?.image_url && !postData.image_url.startsWith('http')) {
                     const { data } = supabase.storage
                         .from('barter-images') // Assuming 'barter-images' bucket
                         .getPublicUrl(postData.image_url);
                     postImageUrl = data.publicUrl;
                } else if (postData?.image_url) {
                     postImageUrl = postData.image_url; // If it's already a full URL
                }

                return {
                    ...request,
                    from_profiles: fromProfileData || { username: 'Unknown User' },
                    posts: { // Ensure posts object exists
                       ...postData,
                       image_url: postImageUrl // Use the guaranteed defined postImageUrl
                    } || {},
                    offer_image_url: offerImageUrl, // Add processed image URL
                };
            }));

            setIncomingRequests(processedIncoming);

            // --- Fetch Outgoing Requests ---
            const { data: outgoingData, error: outgoingError } = await supabase
                .from('barter_requests')
                .select('*, post_id, to_user_id') // Select basic fields + foreign keys
                .eq('from_user_id', userId) // Where current user is the sender
                .eq('status', 'pending') // Only include pending requests
                .order('created_at', { ascending: false });

            if (outgoingError) throw outgoingError;

            // Fetch related data for outgoing requests (recipient profile, post details)
            const processedOutgoing = await Promise.all(outgoingData.map(async (request) => {
                const { data: toProfileData, error: toProfileError } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', request.to_user_id)
                    .single();
                if (toProfileError) console.error('Error fetching to_profile for outgoing request:', toProfileError);

                 const { data: postData, error: postError } = await supabase
                    .from('barter_posts')
                    .select('*, profiles:user_id(username)') // Fetch post details + poster username
                    .eq('post_id', request.post_id)
                    .single();
                if (postError) console.error('Error fetching post for outgoing request:', postError);

                // Get public URL for offer image if it's a path (not a full URL)
                let offerImageUrl = request.offer_image;
                if (offerImageUrl && !offerImageUrl.startsWith('http')) {
                     const { data } = supabase.storage
                         .from('offer-images') // Assuming 'offer-images' bucket
                         .getPublicUrl(offerImageUrl);
                     offerImageUrl = data.publicUrl;
                }

                 // Get public URL for post image if it exists
                let postImageUrl = null; // Initialize postImageUrl
                if (postData?.image_url && !postData.image_url.startsWith('http')) {
                     const { data } = supabase.storage
                         .from('barter-images') // Assuming 'barter-images' bucket
                         .getPublicUrl(postData.image_url);
                     postImageUrl = data.publicUrl;
                } else if (postData?.image_url) {
                     postImageUrl = postData.image_url; // If it's already a full URL
                }

                return {
                    ...request,
                    to_profiles: toProfileData || { username: 'Unknown User' },
                     posts: { // Ensure posts object exists
                        ...postData,
                       image_url: postImageUrl // Use the guaranteed defined postImageUrl
                    } || {},
                     offer_image_url: offerImageUrl, // Add processed image URL
                };
            }));

            setOutgoingRequests(processedOutgoing);

        } catch (err) {
            setError(err.message);
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [userId]);

    // Function to handle deleting a request - moved here
    const handleDeleteRequest = async (requestId) => {
        setLoading(true); // Show loading state while deleting
        setError(null);
        try {
            const { error: deleteError } = await supabase
                .from('barter_requests')
                .delete()
                .eq('id', requestId);

            if (deleteError) throw deleteError;

            // Refetch requests after deletion
            fetchRequests();

        } catch (err) {
            setError('Error deleting request: ' + err.message);
            console.error('Delete request error:', err);
            setLoading(false); // Hide loading on error
        }
    };

    return {
        incomingRequests,
        outgoingRequests,
        loading,
        error,
        handleDeleteRequest, // Expose the delete function
        fetchRequests // Expose fetchRequests to allow refetching from component
    };
};

export default useRequests; 