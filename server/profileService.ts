import { storage } from './storage';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads', 'profiles');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  bio?: string;
  profilePhoto?: string;
}

export class ProfileService {
  static getUploadMiddleware() {
    return upload.single('profilePhoto');
  }

  static async updateProfile(userId: number, profileData: UpdateProfileData): Promise<any> {
    try {
      // Get current user
      const currentUser = await storage.getUser(userId);
      if (!currentUser) {
        throw new Error('User not found');
      }

      // Update user with new profile data
      const updatedUser = await storage.updateUser(userId, {
        ...currentUser,
        ...profileData,
        updatedAt: new Date().toISOString()
      });

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  static async deleteOldProfilePhoto(photoPath: string): Promise<void> {
    try {
      if (photoPath && fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    } catch (error) {
      console.error('Error deleting old profile photo:', error);
    }
  }

  static getProfilePhotoUrl(filename: string): string {
    return `/uploads/profiles/${filename}`;
  }
}