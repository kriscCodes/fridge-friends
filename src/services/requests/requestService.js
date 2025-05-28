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

export const updateCompletionStatus = async (barterId, userId) => {
    console.log('updateCompletionStatus called with barterId:', barterId, 'and userId:', userId);
    try {
        // Fetch the barter request to determine user role
        const { data: barter, error: fetchError } = await supabase
            .from('barter_requests')
            .select('from_user_id, to_user_id, requester_status, poster_status')
            .eq('id', barterId)
            .single();

        if (fetchError) {
            console.error('Error fetching barter in updateCompletionStatus:', fetchError);
            throw fetchError;
        }
        if (!barter) {
             console.error('Barter request not found in updateCompletionStatus for id:', barterId);
            throw new Error('Barter request not found');
        }
        console.log('Fetched barter details:', barter);

        let updateData = {};
        if (userId === barter.from_user_id) {
            console.log('User is requester, setting requester_status to true');
            updateData = { requester_status: true };
        } else if (userId === barter.to_user_id) {
             console.log('User is poster, setting poster_status to true');
            updateData = { poster_status: true };
        } else {
             console.error('User does not match requester or poster for barter id:', barterId);
            throw new Error('User is neither requester nor poster for this barter');
        }
        console.log('Update data prepared:', updateData);

        const { error: updateError } = await supabase
            .from('barter_requests')
            .update(updateData)
            .eq('id', barterId);

        if (updateError) {
            console.error('Error updating completion status in DB:', updateError);
            throw updateError;
        }
        console.log('Individual status updated successfully.');

        // Fetch the updated barter request to check if both users have confirmed
        const { data: updatedBarter, error: fetchUpdatedError } = await supabase
            .from('barter_requests')
            .select('requester_status, poster_status')
            .eq('id', barterId)
            .single();

        if (fetchUpdatedError) { console.error('Error fetching updated barter status after individual update:', fetchUpdatedError); }

        console.log('Updated barter statuses:', updatedBarter);

        if (updatedBarter?.requester_status && updatedBarter?.poster_status) {
            console.log('Both users have confirmed, updating main status to completed.');
            // If both have confirmed, update the main status to 'completed'
            const { error: statusUpdateError } = await supabase
                .from('barter_requests')
                .update({ status: 'completed' })
                .eq('id', barterId);

            if (statusUpdateError) console.error('Error updating main status to completed:', statusUpdateError);
             console.log('Main status updated to completed.');
        } else {
             console.log('Both users have not yet confirmed.');
        }

        return { success: true };
    } catch (error) {
        console.error('Caught error in updateCompletionStatus:', error);
        throw error;
    }
}; 