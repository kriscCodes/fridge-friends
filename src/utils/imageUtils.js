import { supabase } from '@/lib/supabase';
import { STORAGE_BUCKETS } from '@/constants/requestConstants';

export const getPublicImageUrl = async (imagePath, bucketName) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) {
        // Check if it's already a Supabase URL to prevent double processing
        if (imagePath.includes('supabase.co/storage/v1/object/public')) {
            return imagePath;
        }
        // If it's some other URL, return as is
        return imagePath;
    }

    // If it's a relative path, process it
    try {
        const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(imagePath);
        return data.publicUrl;
    } catch (error) {
        console.error('Error processing image URL:', error);
        return null;
    }
};

export const processOfferImage = async (offerImage) => {
    return getPublicImageUrl(offerImage, STORAGE_BUCKETS.OFFER_IMAGES);
};

export const processPostImage = async (postImage) => {
    return getPublicImageUrl(postImage, STORAGE_BUCKETS.BARTER_IMAGES);
};

export const convertHeicToJpeg = async (file) => {
    if (!file) return null;
    
    // Check if the file is HEIC
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        try {
            // Dynamically import heic2any only when needed
            const heic2any = (await import('heic2any')).default;

            // Convert HEIC to JPEG
            const convertedBlob = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 0.8,
            });

            // Create a new File object from the converted blob
            return new File(
                [convertedBlob],
                file.name.replace(/\.heic$/i, '.jpg'),
                { type: 'image/jpeg' }
            );
        } catch (error) {
            console.error('Error converting HEIC image:', error);
            throw new Error('Failed to convert HEIC image. Please try a different file.');
        }
    }
    
    return file;
};

export const uploadImage = async (file, bucketName) => {
    if (!file) return null;

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Return just the file path, not the full URL
        return fileName;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image. Please try again.');
    }
};

export const uploadOfferImage = async (file) => {
    try {
        const convertedFile = await convertHeicToJpeg(file);
        if (!convertedFile) return null;
        
        // Only upload and return the file path
        const filePath = await uploadImage(convertedFile, STORAGE_BUCKETS.OFFER_IMAGES);
        if (!filePath) return null;
        
        // Return just the file path, not the full URL
        return filePath;
    } catch (error) {
        console.error('Error in uploadOfferImage:', error);
        throw error;
    }
};

export const uploadPostImage = async (file) => {
    try {
        const convertedFile = await convertHeicToJpeg(file);
        if (!convertedFile) return null;
        
        // Only upload and return the file path
        const filePath = await uploadImage(convertedFile, STORAGE_BUCKETS.BARTER_IMAGES);
        if (!filePath) return null;
        
        // Return just the file path, not the full URL
        return filePath;
    } catch (error) {
        console.error('Error in uploadPostImage:', error);
        throw error;
    }
}; 