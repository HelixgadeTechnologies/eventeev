import axiosInstance from '@/lib/axios';

export class UploadService {
  /**
   * Upload an image file to the backend, which uploads it to Cloudinary
   * @param file The File object to upload
   * @returns The secure URL and public_id from Cloudinary
   */
  async uploadImage(file: File) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post('/api/upload', formData);

      return { data: response.data, error: null };
    } catch (error: any) {
      console.error('Upload failed:', error);
      return { 
        data: null, 
        error: error.response?.data || { message: 'Image upload failed' } 
      };
    }
  }
}

export const uploadService = new UploadService();
