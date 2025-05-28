import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { updateCompletionStatus } from '@/services/requests/requestService';

export default function useBarters(status = 'accepted') {
    const [barters, setBarters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [selectedBarterForCompletion, setSelectedBarterForCompletion] = useState(null);
    const [isUpdatingCompletionStatus, setIsUpdatingCompletionStatus] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setCurrentUser(user);
        };
        fetchUser();
    }, []);

    const fetchBarters = useCallback(async () => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) { // Handle case where user might not be available yet
                setLoading(false);
                return;
            }

            // Fetch barters
            const { data: bartersData, error: bartersError } = await supabase
                .from('barter_requests')
                .select(
                    `
                    *,
                    barter_posts:post_id (
                        name,
                        description,
                        image_url
                    )
                `
                )
                .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
                .eq('status', status)
                .order('created_at', { ascending: false });

            if (bartersError) throw bartersError;

            // Fetch usernames for each barter
            const bartersWithUsernames = await Promise.all(
                bartersData.map(async (barter) => {
                    const { data: fromProfile } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('id', barter.from_user_id)
                        .single();

                    const { data: toProfile } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('id', barter.to_user_id)
                        .single();

                    return {
                        ...barter,
                        from_user: { username: fromProfile?.username || 'Unknown User' },
                        to_user: { username: toProfile?.username || 'Unknown User' },
                    };
                })
            );

            setBarters(bartersWithUsernames);
        } catch (err) {
            console.error('Error fetching barters:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [status]); // Add status to dependencies

    useEffect(() => {
        if (currentUser) {
            fetchBarters();
        }
    }, [currentUser, fetchBarters]); // Add currentUser and fetchBarters to dependencies

    const handleMarkCompleteClick = (barter) => {
        console.log('handleMarkCompleteClick called with barter:', barter);
        console.log('Current User:', currentUser);
        setSelectedBarterForCompletion(barter);
        setIsCompletionModalOpen(true);
    };

    const handleConfirmCompletion = async () => {
        if (!selectedBarterForCompletion || !currentUser) return;

        setIsUpdatingCompletionStatus(true);
        try {
            await updateCompletionStatus(selectedBarterForCompletion.id, currentUser.id);

            // Close the modal and refetch accepted barters
            setIsCompletionModalOpen(false);
            setSelectedBarterForCompletion(null);
            fetchBarters(); // Call the now accessible fetchBarters

        } catch (err) {
            console.error('Error confirming completion:', err);
            setError(err.message);
        } finally {
            setIsUpdatingCompletionStatus(false);
        }
    };

    const handleCancelCompletion = () => {
        setIsCompletionModalOpen(false);
        setSelectedBarterForCompletion(null);
    };

    // Include fetchBarters in the returned object if needed elsewhere, 
    // though in this case, it's primarily used internally by handleConfirmCompletion
    return {
        barters,
        loading,
        error,
        currentUser,
        handleMarkCompleteClick,
        isCompletionModalOpen,
        selectedBarterForCompletion,
        handleConfirmCompletion,
        handleCancelCompletion,
        isUpdatingCompletionStatus,
       // fetchBarters, // Uncomment if you need to expose fetchBarters outside
    };
} 