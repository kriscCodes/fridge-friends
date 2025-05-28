'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchRequests, deleteRequest, updateRequestStatus, updatePostStatus } from '@/services/requests/requestService';
import { REQUEST_STATUS, POST_STATUS } from '@/constants/requestConstants';

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

    const fetchAllRequests = async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const [incoming, outgoing] = await Promise.all([
                fetchRequests(userId, 'incoming'),
                fetchRequests(userId, 'outgoing')
            ]);

            setIncomingRequests(incoming);
            setOutgoingRequests(outgoing);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllRequests();
    }, [userId]);

    const handleDeleteRequest = async (requestId) => {
        setLoading(true);
        setError(null);
        try {
            await deleteRequest(requestId);
            await fetchAllRequests();
        } catch (err) {
            setError('Error deleting request: ' + err.message);
            console.error('Delete request error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestStatusChange = async (requestId, action, postId) => {
        setLoading(true);
        setError(null);

        try {
            await updateRequestStatus(requestId, action);

            if (action === REQUEST_STATUS.ACCEPTED && postId) {
                await updatePostStatus(postId, POST_STATUS.INACTIVE);
            }

            await fetchAllRequests();
        } catch (err) {
            setError('Error updating request status: ' + err.message);
            console.error('Error in handleRequestStatusChange:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        incomingRequests,
        outgoingRequests,
        loading,
        error,
        handleDeleteRequest,
        handleRequestStatusChange,
        fetchRequests: fetchAllRequests
    };
};

export default useRequests; 