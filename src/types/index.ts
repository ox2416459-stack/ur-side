export type ContentType = 'post' | 'video';

export type PostState = 'published' | 'draft' | 'archived';

export interface PostItem {
  id: string;
  slug: string;
  title: string;
  contentType: ContentType;
  category: string;
  videoUrl?: string;
  videoDuration?: string;
  thumbnailUrl: string;
  galleryImages?: string[];
  description: string;
  fullContent: string;
  tags: string[];
  postState: PostState;
  isFeatured: boolean;
  isPremium: boolean;
  publishedDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  viewsCount: number;
  updatedAt: string;
}

export type AdType = 'banner_header' | 'banner_sidebar' | 'banner_content' | 'banner_footer' | 'social_bar' | 'popunder';

export interface AdPlacement {
  id: string;
  name: string;
  type: AdType;
  description: string;
  enabled: boolean;
  scriptCode: string;
  placementId?: string;
  deviceTarget: 'all' | 'desktop' | 'mobile';
  sizeLabel: string;
  frequencyMinutes?: number;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoText: string;
  announcementBar: {
    enabled: boolean;
    text: string;
    link?: string;
    type: 'info' | 'warning' | 'success';
  };
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  facebookUrl: string;
  telegramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  metaDescription: string;
  defaultOgImage: string;
  disclaimerText: string;
}

export type UserStatus = 'active' | 'blocked' | 'pending';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Super Admin' | 'Content Editor' | 'Video Manager';
  avatar: string;
  status: UserStatus;
  isForceLoggedOut: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  isPremium: boolean;
  isBlocked: boolean;
  premiumRequested?: boolean;
  createdAt: string;
  lastLogin: string;
}

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  sizeKb: number;
  mimeType: string;
  uploadedAt: string;
}
