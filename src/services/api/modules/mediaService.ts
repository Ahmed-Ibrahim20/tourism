import { httpClient } from '../httpClient';
import { ApiResponse } from '../types/common';

export interface UploadedMedia {
  path: string;  // stored path to save as cover_image in DB
  url: string;   // full public URL for preview
}

export class AdminMediaService {
  /**
   * Upload a single image file.
   * @param file    - The File object from <input type="file">
   * @param folder  - Storage subfolder e.g. "destinations", "services", "packages"
   */
  async upload(file: File, folder: string = 'uploads'): Promise<ApiResponse<UploadedMedia>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return httpClient.post<ApiResponse<UploadedMedia>>('/admin/media/upload', formData, {
      headers: {
        // Let axios set multipart/form-data with boundary automatically
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Delete a previously uploaded image by its stored path.
   * @param path - The path returned by upload() e.g. "destinations/uuid.jpg"
   */
  async delete(path: string): Promise<ApiResponse<null>> {
    return httpClient.delete<ApiResponse<null>>('/admin/media', { data: { path } });
  }
}

export const adminMediaService = new AdminMediaService();
