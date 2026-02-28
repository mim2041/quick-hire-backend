import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import path from 'path';
import httpStatus from 'http-status';
import env from '../../config/env';
import AppError from '../../errors/AppError';

type MediaKind = 'image' | 'video' | 'document';
type MediaResourceType = 'image' | 'video' | 'raw';

class CloudinaryFileUploadService {
  constructor() {
    const hasKeyConfig =
      !!env.cloudinaryCloudName && !!env.cloudinaryApiKey && !!env.cloudinaryApiSecret;

    if (hasKeyConfig) {
      cloudinary.config({
        cloud_name: env.cloudinaryCloudName,
        api_key: env.cloudinaryApiKey,
        api_secret: env.cloudinaryApiSecret,
        secure: true,
      });
      return;
    }

    if (env.cloudinaryUrl) {
      process.env.CLOUDINARY_URL = env.cloudinaryUrl;
      cloudinary.config({ secure: true });
    }
  }

  private ensureCloudinaryConfig(): void {
    const hasCloudinaryUrl = !!env.cloudinaryUrl;
    const hasCloudinaryKeyConfig =
      !!env.cloudinaryCloudName && !!env.cloudinaryApiKey && !!env.cloudinaryApiSecret;

    if (!hasCloudinaryUrl && !hasCloudinaryKeyConfig) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Cloudinary is not configured. Please set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.'
      );
    }
  }

  private mapResourceType(mediaType: MediaKind): MediaResourceType {
    if (mediaType === 'document') {
      return 'raw';
    }

    return mediaType;
  }

  private sanitizeFileName(fileName: string): string {
    const fileExtension = fileName.split('.').pop() || 'file';
    const fileNameWithoutExtension = path.parse(fileName).name;
    const sanitizedFileName = fileNameWithoutExtension.replace(/[^a-zA-Z0-9.]/g, '-');

    return `${sanitizedFileName}-${Date.now()}.${fileExtension}`;
  }

  generatePublicId(fileName: string, featureName: string): string {
    const sanitizedFileName = this.sanitizeFileName(fileName);
    const safeFeatureName = featureName.trim().replace(/^\/+|\/+$/g, '');
    return `${safeFeatureName}/${sanitizedFileName}`;
  }

  async uploadFile(file: Express.Multer.File, featureName: string): Promise<UploadApiResponse> {
    this.ensureCloudinaryConfig();

    const publicId = this.generatePublicId(file.originalname, featureName);
    const base64Data = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64Data}`;

    return cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      resource_type: 'auto',
      overwrite: false,
    });
  }

  async deleteByPublicId(publicId: string, mediaType: MediaKind): Promise<void> {
    this.ensureCloudinaryConfig();

    const resourceType = this.mapResourceType(mediaType);
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
  }

  async deleteMultipleByPublicIds(publicIds: string[], mediaType: MediaKind): Promise<void> {
    if (!publicIds.length) {
      return;
    }

    this.ensureCloudinaryConfig();

    const resourceType = this.mapResourceType(mediaType);
    await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
      invalidate: true,
    });
  }
}

export const cloudinaryFileUploadService = new CloudinaryFileUploadService();
