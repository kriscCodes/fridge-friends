import { supabase } from '@/lib/supabase';
import { processOfferImage, processPostImage } from '@/utils/imageUtils';
import { REQUEST_STATUS, POST_STATUS } from '@/constants/requestConstants';

export const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();
    
    if (error) {
        console.error('Error fetching profile:', error);
        return { username: 'Unknown User' };
    }
    return data;
};

export const fetchPostDetails = async (postId) => {
    const { data, error } = await supabase
        .from('barter_posts')
        .select('*, profiles:user_id(username)')
        .eq('post_id', postId)
        .single();

    if (error) {
        console.error('Error fetching post:', error);
        return null;
    }

    if (data?.image_url) {
        data.image_url = await processPostImage(data.image_url);
    }

    return data;
};

export const processRequestData = async (request, isIncoming = true) => {
    const userIdField = isIncoming ? 'from_user_id' : 'to_user_id';
    const profileData = await fetchUserProfile(request[userIdField]);
    const postData = await fetchPostDetails(request.post_id);
    const offerImageUrl = await processOfferImage(request.offer_image);

    return {
        ...request,
        [`${isIncoming ? 'from' : 'to'}_profiles`]: profileData,
        posts: postData || {},
        offer_image_url: offerImageUrl
    };
};

export const fetchRequests = async (userId, type = 'incoming') => {
    const query = supabase
        .from('barter_requests')
        .select('*, post_id, from_user_id, to_user_id')
        .eq(type === 'incoming' ? 'to_user_id' : 'from_user_id', userId)
        .eq('status', REQUEST_STATUS.PENDING)
        .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    return Promise.all(data.map(request => 
        processRequestData(request, type === 'incoming')
    ));
};

export const deleteRequest = async (requestId) => {
    const { error } = await supabase
        .from('barter_requests')
        .delete()
        .eq('id', requestId);
    
    if (error) throw error;
};

export const updateRequestStatus = async (requestId, status) => {
    const { error } = await supabase
        .from('barter_requests')
        .update({ status })
        .eq('id', requestId);
    
    if (error) throw error;
};

export const updatePostStatus = async (postId, status) => {
    const { error } = await supabase
        .from('barter_posts')
        .update({ status })
        .eq('post_id', postId);
    
    if (error) throw error;
};

export const createRequest = async (requestData) => {
    const { error } = await supabase
        .from('barter_requests')
        .insert(requestData);
    
    if (error) throw error;
}; 