import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  PostItem, 
  AdPlacement, 
  SiteSettings, 
  AdminUser, 
  PublicUser,
  AccessRequest,
  AuditLog, 
  MediaItem 
} from '../types';
import { 
  INITIAL_POSTS, 
  INITIAL_AD_PLACEMENTS, 
  INITIAL_SITE_SETTINGS, 
  INITIAL_ADMIN_USERS, 
  INITIAL_PUBLIC_USERS,
  INITIAL_ACCESS_REQUESTS,
  INITIAL_AUDIT_LOGS, 
  INITIAL_MEDIA_ITEMS,
  INITIAL_CATEGORIES
} from '../data/initialData';
import { idbGet, idbSet } from '../utils/storage';
import { db, testConnection, handleFirestoreError, OperationType, sanitizeForFirestore } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch
} from 'firebase/firestore';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ShareModalPayload {
  title: string;
  url: string;
  description?: string;
  image?: string;
}

interface AppContextType {
  // Navigation
  currentRoute: string;
  navigateTo: (route: string) => void;
  categories: string[];

  // Cloud Sync
  isCloudConnected: boolean;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline';
  syncToCloudNow: () => Promise<void>;

  // Posts & Videos
  posts: PostItem[];
  addPost: (post: Omit<PostItem, 'id' | 'viewsCount' | 'updatedAt'>) => Promise<void>;
  updatePost: (id: string, post: Partial<PostItem>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;

  // Ads & Settings
  adPlacements: AdPlacement[];
  updateAdPlacement: (id: string, placement: Partial<AdPlacement>) => void;
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;

  // Media
  mediaItems: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => void;
  deleteMediaItem: (id: string) => void;

  // Admin Staff Users & Permissions
  users: AdminUser[];
  addUser: (userData: { name: string; email: string; password: string; role: AdminUser['role'] }) => void;
  updateUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;
  toggleBlockUser: (id: string) => void;
  forceLogoutUser: (id: string) => void;

  // Public Registered Users (via Account button)
  publicUsers: PublicUser[];
  currentPublicUser: PublicUser | null;
  registerPublicUser: (name: string, email: string, password: string) => { success: boolean; message: string };
  loginPublicUser: (email: string, password: string) => { success: boolean; message: string };
  logoutPublicUser: () => void;
  requestPremium: () => void;
  toggleBlockPublicUser: (id: string) => void;
  togglePremiumPublicUser: (id: string) => void;
  deletePublicUser: (id: string) => void;

  // Access Permission Requests
  accessRequests: AccessRequest[];
  submitAccessRequest: (name: string, email: string, phone: string, reason: string) => void;
  approveAccessRequest: (id: string, password: string, role: AdminUser['role']) => void;
  rejectAccessRequest: (id: string) => void;

  // Admin Auth Session
  adminUser: AdminUser | null;
  loginAdmin: (email: string, password: string) => { success: boolean; message: string };
  logoutAdmin: () => void;

  // System & Audit
  auditLogs: AuditLog[];
  restoreDefaultData: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Share Modal
  shareModal: ShareModalPayload | null;
  openShareModal: (payload: ShareModalPayload) => void;
  closeShareModal: () => void;

  // Account Modal
  accountModalOpen: boolean;
  openAccountModal: () => void;
  closeAccountModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  POSTS: 'nks_posts_v5',
  ADS: 'nks_ads_v5',
  SETTINGS: 'nks_settings_v5',
  USERS: 'nks_users_v5',
  PUBLIC_USERS: 'nks_public_users_v5',
  CURRENT_PUBLIC_USER: 'nks_current_pub_v5',
  REQUESTS: 'nks_requests_v5',
  ADMIN_SESSION: 'nks_session_v5',
  AUDIT: 'nks_audit_v5',
  MEDIA: 'nks_media_v5',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [categories] = useState<string[]>(INITIAL_CATEGORIES);

  // Cloud Sync Status
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Posts & Videos
  const [posts, setPosts] = useState<PostItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  // Ads
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADS);
      return saved ? JSON.parse(saved) : INITIAL_AD_PLACEMENTS;
    } catch {
      return INITIAL_AD_PLACEMENTS;
    }
  });

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (typeof parsed.siteName === 'string') && (parsed.siteName.includes('কাকের') || parsed.siteName.includes('শুত্র') || parsed.siteName.includes('শুএ'))) {
          parsed.siteName = 'নতুন কাজের সূত্র';
          parsed.logoText = 'নতুন কাজের সূত্র';
        }
        return parsed || INITIAL_SITE_SETTINGS;
      }
      return INITIAL_SITE_SETTINGS;
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  });

  // Admin Staff Users
  const [users, setUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      let list = saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
      const hasOvijit = list.some((u: AdminUser) => u.email.toLowerCase() === 'ovijitmondal08804@gmail.com');
      if (!hasOvijit) {
        list = [...INITIAL_ADMIN_USERS, ...list];
      }
      return list;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  // Public Registered Users
  const [publicUsers, setPublicUsers] = useState<PublicUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PUBLIC_USERS);
      return saved ? JSON.parse(saved) : INITIAL_PUBLIC_USERS;
    } catch {
      return INITIAL_PUBLIC_USERS;
    }
  });

  // Current logged in public user
  const [currentPublicUser, setCurrentPublicUser] = useState<PublicUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_PUBLIC_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Access Requests
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return saved ? JSON.parse(saved) : INITIAL_ACCESS_REQUESTS;
    } catch {
      return INITIAL_ACCESS_REQUESTS;
    }
  });

  // Admin Session
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Media
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
      return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
    } catch {
      return INITIAL_MEDIA_ITEMS;
    }
  });

  // Toasts, Modals
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [shareModal, setShareModal] = useState<ShareModalPayload | null>(null);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  // Guards against write-exhaustion and duplicate syncs
  const isSyncingPostsRef = useRef(false);
  const isSyncingUsersRef = useRef(false);

  // Validate Firestore connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // REAL-TIME FIRESTORE SYNCHRONIZATION
  // When ANY user or admin opens the website, Firestore delivers real-time updates!
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const postsCol = collection(db, 'posts');
      unsubscribe = onSnapshot(postsCol, (snapshot) => {
        if (!snapshot.empty) {
          const cloudPosts: PostItem[] = [];
          snapshot.forEach((docSnap) => {
            cloudPosts.push(docSnap.data() as PostItem);
          });
          // Sort by publishedDate or updatedAt descending
          cloudPosts.sort((a, b) => new Date(b.publishedDate || b.updatedAt).getTime() - new Date(a.publishedDate || a.updatedAt).getTime());
          setPosts(cloudPosts);
          idbSet(STORAGE_KEYS.POSTS, cloudPosts);
          try { localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(cloudPosts)); } catch {}
          setIsCloudConnected(true);
          setCloudSyncStatus('synced');
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'posts');
        setIsCloudConnected(false);
        setCloudSyncStatus('offline');
      });
    } catch (err) {
      console.warn('Firebase init notice:', err);
    }

    return () => unsubscribe();
  }, []);

  // Global Settings sync from Firestore
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const settingsDocRef = doc(db, 'settings', 'global');
      unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudSettings = docSnap.data() as SiteSettings;
          setSiteSettings(prev => ({ ...prev, ...cloudSettings }));
          try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(cloudSettings)); } catch {}
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/global');
      });
    } catch {}

    return () => unsubscribe();
  }, []);

  // REAL-TIME PUBLIC USERS & PREMIUM REQUESTS SYNCHRONIZATION
  // When ANY user registers or requests premium on any device, the admin instantly sees it live!
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const usersCol = collection(db, 'public_users');
      unsubscribe = onSnapshot(usersCol, (snapshot) => {
        if (!snapshot.empty) {
          const cloudUsers: PublicUser[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const displayName = (typeof data.name === 'string' && data.name.trim())
              ? data.name.trim()
              : (data.email ? data.email.split('@')[0] : 'ইউজার');
            cloudUsers.push({
              id: docSnap.id,
              ...data,
              name: displayName,
              email: data.email || '',
              password: data.password || '',
              isPremium: Boolean(data.isPremium),
              isBlocked: Boolean(data.isBlocked),
              premiumRequested: Boolean(data.premiumRequested),
              createdAt: data.createdAt || new Date().toISOString().slice(0, 10),
              lastLogin: data.lastLogin || ''
            } as PublicUser);
          });
          // Sort newest registration first
          cloudUsers.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setPublicUsers(cloudUsers);
          try { localStorage.setItem(STORAGE_KEYS.PUBLIC_USERS, JSON.stringify(cloudUsers)); } catch {}

          // Automatically sync active public user's state when Admin changes their status or grants premium
          setCurrentPublicUser((prev) => {
            if (!prev) return null;
            const updatedSelf = cloudUsers.find(u => u.id === prev.id || u.email.toLowerCase() === prev.email.toLowerCase());
            if (updatedSelf) {
              if (!prev.isPremium && updatedSelf.isPremium) {
                showToast('🎉 অভিনন্দন! প্রধান পরিচালক আপনার প্রিমিয়াম পারমিশন অনুমোদন করেছেন! এক্সক্লুসিভ কন্টেন্ট এখন আনলক।', 'success');
              }
              if (!prev.isBlocked && updatedSelf.isBlocked) {
                showToast('আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক ব্লক করা হয়েছে।', 'error');
                return null;
              }
              try { localStorage.setItem(STORAGE_KEYS.CURRENT_PUBLIC_USER, JSON.stringify(updatedSelf)); } catch {}
              return updatedSelf;
            }
            return prev;
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'public_users');
      });
    } catch (e) {
      console.warn('Failed to listen to public_users:', e);
    }

    return () => unsubscribe();
  }, []);

  // Seed initial posts to Firestore (called on demand by Admin restoreDefaultData)
  const seedInitialPostsToFirestore = async () => {
    if (isSyncingPostsRef.current) return;
    isSyncingPostsRef.current = true;
    try {
      setCloudSyncStatus('syncing');
      const batch = writeBatch(db);
      INITIAL_POSTS.forEach((post) => {
        const docRef = doc(db, 'posts', post.id);
        batch.set(docRef, sanitizeForFirestore(post));
      });
      await batch.commit();
      setIsCloudConnected(true);
      setCloudSyncStatus('synced');
    } catch (e) {
      console.warn('Seeding initial posts to Firestore notice:', e);
      handleFirestoreError(e, OperationType.WRITE, 'posts');
      setCloudSyncStatus('offline');
    } finally {
      isSyncingPostsRef.current = false;
    }
  };

  // Seed initial users to Firestore
  const seedInitialUsersToFirestore = async () => {
    if (isSyncingUsersRef.current) return;
    isSyncingUsersRef.current = true;
    try {
      const batch = writeBatch(db);
      INITIAL_PUBLIC_USERS.forEach((pu) => {
        const docRef = doc(db, 'public_users', pu.id);
        batch.set(docRef, sanitizeForFirestore(pu), { merge: true });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Seeding initial public users to Firestore notice:', e);
      handleFirestoreError(e, OperationType.WRITE, 'public_users');
    } finally {
      isSyncingUsersRef.current = false;
    }
  };

  // Manual trigger to force-sync all local posts to Cloud
  const syncToCloudNow = async () => {
    if (isSyncingPostsRef.current) return;
    isSyncingPostsRef.current = true;
    setCloudSyncStatus('syncing');
    showToast('ক্লাউড ডাটাবেজে সকল পোস্ট সিঙ্ক করা হচ্ছে...', 'info');
    try {
      const batch = writeBatch(db);
      posts.forEach(p => {
        const ref = doc(db, 'posts', p.id);
        batch.set(ref, sanitizeForFirestore(p), { merge: true });
      });
      await batch.commit();
      setIsCloudConnected(true);
      setCloudSyncStatus('synced');
      showToast('সকল ভিডিও ও পোস্ট সফলভাবে ক্লাউডে সিঙ্ক হয়েছে! এখন যেকোনো ডিভাইস বা ওয়েবসাইট থেকে সরাসরি লাইভ দেখা যাবে।', 'success');
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, 'posts');
      showToast('ক্লাউড সিঙ্ক করতে সমস্যা হয়েছে। ইন্টারনেট কানেকশন চেক করুন।', 'error');
      setCloudSyncStatus('offline');
    } finally {
      isSyncingPostsRef.current = false;
    }
  };

  // Sync state to local storage & IndexedDB
  useEffect(() => {
    idbSet(STORAGE_KEYS.POSTS, posts);
    try { localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts)); } catch {}
  }, [posts]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(adPlacements)); } catch {}
  }, [adPlacements]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings)); } catch {}
  }, [siteSettings]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); } catch {}
  }, [users]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PUBLIC_USERS, JSON.stringify(publicUsers)); } catch {}
  }, [publicUsers]);

  useEffect(() => {
    try {
      if (currentPublicUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PUBLIC_USER, JSON.stringify(currentPublicUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_PUBLIC_USER);
      }
    } catch {}
  }, [currentPublicUser]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(accessRequests)); } catch {}
  }, [accessRequests]);

  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(adminUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      }
    } catch {}
  }, [adminUser]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs)); } catch {}
  }, [auditLogs]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaItems)); } catch {}
  }, [mediaItems]);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logAudit = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      module,
      performedBy: adminUser ? `${adminUser.name} (${adminUser.role})` : 'অভিজিৎ মণ্ডল (সুপার অ্যাডমিন)',
      timestamp: new Date().toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' }),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Post Actions with REAL CLOUD SAVING
  const addPost = async (postData: Omit<PostItem, 'id' | 'viewsCount' | 'updatedAt'>) => {
    const newPost: PostItem = {
      ...postData,
      id: `post-${Date.now()}`,
      viewsCount: 1,
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    // 1. Immediately update UI
    setPosts(prev => [newPost, ...prev]);

    // 2. Persist to Firestore Cloud Database
    setCloudSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'posts', newPost.id), sanitizeForFirestore(newPost));
      setIsCloudConnected(true);
      setCloudSyncStatus('synced');
      showToast(newPost.contentType === 'video' ? 'ভিডিও সফলভাবে ক্লাউডে আপলোড ও লাইভ প্রকাশ হয়েছে!' : 'পোস্ট সফলভাবে ক্লাউডে সংরক্ষিত ও লাইভ হয়েছে!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `posts/${newPost.id}`);
      showToast('পোস্ট লোকালি সংরক্ষিত হয়েছে। ক্লাউড সংযোগের পর স্বয়ংক্রিয়ভাবে লাইভ হবে।', 'info');
    }

    logAudit('নতুন কন্টেন্ট প্রকাশ', newPost.contentType === 'video' ? 'ভিডিও পোস্ট' : 'পোস্ট', `"${newPost.title}" সফলভাবে লাইভ প্রকাশ করা হয়েছে।`);
  };

  const updatePost = async (id: string, updatedData: Partial<PostItem>) => {
    const updatedPostData = { ...updatedData, updatedAt: new Date().toISOString().slice(0, 10) };
    
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedPostData };
      }
      return p;
    }));

    // Update in Firestore
    try {
      await setDoc(doc(db, 'posts', id), sanitizeForFirestore(updatedPostData), { merge: true });
      showToast('পোস্ট ক্লাউডে হালনাগাদ করা হয়েছে!', 'success');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `posts/${id}`);
      showToast('পোস্ট লোকালি হালনাগাদ হয়েছে।', 'info');
    }

    logAudit('পোস্ট হালনাগাদ', 'কন্টেন্ট', `পোস্ট #${id} আপডেট সম্পন্ন হয়েছে।`);
  };

  const deletePost = async (id: string) => {
    const p = posts.find(item => item.id === id);
    setPosts(prev => prev.filter(item => item.id !== id));

    try {
      await deleteDoc(doc(db, 'posts', id));
      showToast('পোস্টটি ক্লাউড থেকে মুছে ফেলা হয়েছে।', 'info');
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `posts/${id}`);
      showToast('পোস্টটি মুছে ফেলা হয়েছে।', 'info');
    }

    logAudit('পোস্ট অপসারণ', 'কন্টেন্ট', `"${p?.title || id}" মুছে ফেলা হয়েছে।`);
  };

  // Ads & Settings
  const updateAdPlacement = (id: string, data: Partial<AdPlacement>) => {
    setAdPlacements(prev => prev.map(ad => ad.id === id ? { ...ad, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : ad));
    showToast('বিজ্ঞাপন সেটিংস সংরক্ষিত হয়েছে!', 'success');
  };

  const updateSiteSettings = async (newSettings: Partial<SiteSettings>) => {
    const merged = { ...siteSettings, ...newSettings };
    setSiteSettings(merged);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'settings', 'global'), sanitizeForFirestore(merged), { merge: true });
      showToast('ওয়েবসাইট সেটিংস ক্লাউডে সংরক্ষিত হয়েছে!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/global');
      showToast('ওয়েবসাইট সেটিংস সংরক্ষিত হয়েছে!', 'success');
    }
  };

  // Media
  const addMediaItem = (item: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    const newItem: MediaItem = {
      ...item,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString().slice(0, 10)
    };
    setMediaItems(prev => [newItem, ...prev]);
    showToast('মিডিয়া ফাইল সফলভাবে যুক্ত হয়েছে!', 'success');
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
    showToast('মিডিয়া ফাইল অপসারিত হয়েছে।', 'info');
  };

  // Public User Account Management
  const registerPublicUser = (name: string, email: string, password: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (publicUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'এই জিমেইল/ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে! অনুগ্রহ করে সাইন ইন করুন।' };
    }

    const displayName = (name && name.trim()) || cleanEmail.split('@')[0] || 'ইউজার';
    const newUser: PublicUser = {
      id: `pub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: displayName,
      email: cleanEmail,
      password: cleanPass,
      isPremium: false,
      isBlocked: false,
      premiumRequested: false,
      createdAt: new Date().toISOString().slice(0, 10),
      lastLogin: new Date().toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' })
    };

    const nextUsers = [newUser, ...publicUsers];
    setPublicUsers(nextUsers);
    setCurrentPublicUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEYS.PUBLIC_USERS, JSON.stringify(nextUsers));
      localStorage.setItem(STORAGE_KEYS.CURRENT_PUBLIC_USER, JSON.stringify(newUser));
    } catch {}

    // Save directly to Firestore Cloud Database so Admin sees it live!
    setDoc(doc(db, 'public_users', newUser.id), sanitizeForFirestore(newUser)).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `public_users/${newUser.id}`);
    });

    logAudit('নতুন পাবলিক ইউজার রেজিস্ট্রেশন', 'ইউজার অ্যাকাউন্ট', `${newUser.name} (${newUser.email}) অ্যাকাউন্ট তৈরি করেছেন।`);
    showToast(`স্বাগতম, ${newUser.name}! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।`, 'success');
    return { success: true, message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।' };
  };

  const loginPublicUser = (email: string, password: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const user = publicUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি! অনুগ্রহ করে অ্যাকাউন্ট তৈরি করুন।' };
    }

    if (user.isBlocked) {
      return { success: false, message: 'আপনার অ্যাকাউন্টটি অ্যাডমিন কর্তৃক সাময়িকভাবে ব্লক করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।' };
    }

    if (user.password !== cleanPass) {
      return { success: false, message: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।' };
    }

    const updated = {
      ...user,
      name: user.name || cleanEmail.split('@')[0] || 'ইউজার',
      lastLogin: new Date().toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' })
    };

    const nextUsers = publicUsers.map(u => u.id === user.id ? updated : u);
    setPublicUsers(nextUsers);
    setCurrentPublicUser(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PUBLIC_USERS, JSON.stringify(nextUsers));
      localStorage.setItem(STORAGE_KEYS.CURRENT_PUBLIC_USER, JSON.stringify(updated));
    } catch {}

    // Update lastLogin in Firestore
    setDoc(doc(db, 'public_users', user.id), sanitizeForFirestore({ lastLogin: updated.lastLogin }), { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `public_users/${user.id}`);
    });

    showToast(`স্বাগতম, ${updated.name}! সফলভাবে লগইন সম্পন্ন হয়েছে।`, 'success');
    return { success: true, message: 'লগইন সফল হয়েছে।' };
  };

  const logoutPublicUser = () => {
    setCurrentPublicUser(null);
    try { localStorage.removeItem(STORAGE_KEYS.CURRENT_PUBLIC_USER); } catch {}
    showToast('আপনার অ্যাকাউন্ট থেকে সফলভাবে লগআউট হয়েছেন।', 'info');
  };

  const requestPremium = () => {
    if (!currentPublicUser) {
      setAccountModalOpen(true);
      showToast('প্রিমিয়াম পারমিশনের আবেদন করতে প্রথমে অ্যাকাউন্টে লগইন করুন।', 'error');
      return;
    }

    const updated: PublicUser = {
      ...currentPublicUser,
      name: currentPublicUser.name || currentPublicUser.email?.split('@')[0] || 'ইউজার',
      premiumRequested: true
    };
    setCurrentPublicUser(updated);
    const nextUsers = publicUsers.map(u => u.id === currentPublicUser.id ? updated : u);
    setPublicUsers(nextUsers);
    try {
      localStorage.setItem(STORAGE_KEYS.PUBLIC_USERS, JSON.stringify(nextUsers));
      localStorage.setItem(STORAGE_KEYS.CURRENT_PUBLIC_USER, JSON.stringify(updated));
    } catch {}

    // Instantly persist request to Firestore so Admin dashboard receives it live!
    setDoc(doc(db, 'public_users', currentPublicUser.id), sanitizeForFirestore(updated), { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `public_users/${currentPublicUser.id}`);
    });

    logAudit('প্রিমিয়াম আবেদন', 'প্রিমিয়াম কন্ট্রোল', `${updated.name} (${updated.email}) প্রিমিয়াম পারমিশনের আবেদন পাঠিয়েছেন।`);
    showToast('আপনার প্রিমিয়াম পারমিশনের আবেদন পরিচালকের কাছে পাঠানো হয়েছে। অনুমোদনের পর দেখতে পারবেন!', 'success');
  };

  const toggleBlockPublicUser = (id: string) => {
    const user = publicUsers.find(u => u.id === id);
    if (!user) return;
    const nextBlocked = !user.isBlocked;
    const updated: PublicUser = {
      ...user,
      name: user.name || user.email?.split('@')[0] || 'ইউজার',
      isBlocked: nextBlocked
    };

    if (currentPublicUser?.id === id && nextBlocked) {
      setCurrentPublicUser(null);
      try { localStorage.removeItem(STORAGE_KEYS.CURRENT_PUBLIC_USER); } catch {}
    }

    const nextUsers = publicUsers.map(u => u.id === id ? updated : u);
    setPublicUsers(nextUsers);
    try { localStorage.setItem(STORAGE_KEYS.PUBLIC_USERS, JSON.stringify(nextUsers)); } catch {}

    setDoc(doc(db, 'public_users', id), sanitizeForFirestore(updated), { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `public_users/${id}`);
    });

    const action = nextBlocked ? 'ব্লক' : 'আনব্লক';
    logAudit(`পাবলিক ইউজার ${action}`, 'অ্যাকাউন্ট কন্ট্রোল', `${updated.name} কে ${action} করা হয়েছে।`);
    showToast(`ব্যবহারকারীকে সফলভাবে ${action} করা হয়েছে!`, 'info');
  };

  const togglePremiumPublicUser = (id: string) => {
    const user = publicUsers.find(u => u.id === id);
    if (!user) return;
    const nextPremium = !user.isPremium;
    const updated: PublicUser = {
      ...user,
      name: user.name || user.email?.split('@')[0] || 'ইউজার',
      isPremium: nextPremium,
      premiumRequested: false
    };

    if (currentPublicUser?.id === id) {
      setCurrentPublicUser(updated);
      try { localStorage.setItem(STORAGE_KEYS.CURRENT_PUBLIC_USER, JSON.stringify(updated)); } catch {}
    }

    const nextUsers = publicUsers.map(u => u.id === id ? updated : u);
    setPublicUsers(nextUsers);
    try { localStorage.setItem(STORAGE_KEYS.PUBLIC_USERS, JSON.stringify(nextUsers)); } catch {}

    // Save full document to Firestore so live listeners receive full updated object
    setDoc(doc(db, 'public_users', id), sanitizeForFirestore(updated), { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.UPDATE, `public_users/${id}`);
    });

    const action = nextPremium ? 'প্রিমিয়াম পারমিশন সক্রিয়' : 'প্রিমিয়াম বাতিল';
    logAudit(action, 'প্রিমিয়াম কন্ট্রোল', `${updated.name} (${updated.email}) এর জন্য ${action} করা হয়েছে।`);
    showToast(`"${updated.name}" এর জন্য ${action} সফলভাবে ক্লাউডে সংরক্ষিত হয়েছে!`, 'success');
  };

  const deletePublicUser = (id: string) => {
    setPublicUsers(prev => prev.filter(u => u.id !== id));
    if (currentPublicUser?.id === id) {
      setCurrentPublicUser(null);
    }
    deleteDoc(doc(db, 'public_users', id)).catch((err) => {
      handleFirestoreError(err, OperationType.DELETE, `public_users/${id}`);
    });
    showToast('ব্যবহারকারী সফলভাবে ক্লাউড থেকে অপসারিত হয়েছে।', 'info');
  };

  // Staff User Controls
  const addUser = (userData: { name: string; email: string; password: string; role: AdminUser['role'] }) => {
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: userData.role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      status: 'active',
      isForceLoggedOut: false,
      createdAt: new Date().toISOString().slice(0, 10),
      lastLogin: 'এখনো লগইন করেনি'
    };
    setUsers(prev => [newUser, ...prev]);
    showToast(`নতুন স্টাফ "${newUser.name}" সফলভাবে যুক্ত হয়েছে!`, 'success');
  };

  const updateUser = (id: string, updates: Partial<AdminUser>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    showToast('স্টাফ তথ্য সংরক্ষিত হয়েছে!', 'success');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('স্টাফ অপসারিত হয়েছে।', 'info');
  };

  const toggleBlockUser = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'blocked' ? 'active' : 'blocked';
        return { ...u, status: nextStatus, isForceLoggedOut: nextStatus === 'blocked' ? true : u.isForceLoggedOut };
      }
      return u;
    }));
    showToast('স্টাফ স্ট্যাটাস পরিবর্তন করা হয়েছে!', 'info');
  };

  const forceLogoutUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isForceLoggedOut: true } : u));
    if (adminUser?.id === id) {
      setAdminUser(null);
    }
    showToast('ফোর্স লগআউট সম্পন্ন হয়েছে!', 'success');
  };

  // Access Permission Workflow
  const submitAccessRequest = (name: string, email: string, phone: string, reason: string) => {
    const newReq: AccessRequest = {
      id: `req-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      phone,
      reason,
      status: 'pending',
      requestedAt: new Date().toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' })
    };
    setAccessRequests(prev => [newReq, ...prev]);
    showToast('আপনার আবেদন প্রধান পরিচালকের কাছে পাঠানো হয়েছে।', 'success');
  };

  const approveAccessRequest = (id: string, password: string, role: AdminUser['role'] = 'Content Editor') => {
    const req = accessRequests.find(r => r.id === id);
    if (!req) return;

    addUser({ name: req.name, email: req.email, password, role });
    setAccessRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    showToast(`"${req.name}" এর আবেদন অনুমোদিত হয়েছে!`, 'success');
  };

  const rejectAccessRequest = (id: string) => {
    setAccessRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    showToast('অনুরোধটি বাতিল করা হয়েছে।', 'info');
  };

  // Admin Auth Login
  const loginAdmin = (email: string, password: string): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Direct Super Admin verification for Ovijit
    if (cleanEmail === 'ovijitmondal08804@gmail.com') {
      if (cleanPass !== 'ovijit12@@##') {
        return { success: false, message: 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।' };
      }
      const superAdminUser: AdminUser = {
        id: 'usr-ovijit',
        name: 'অভিজিৎ মণ্ডল (প্রধান সুপার অ্যাডমিন)',
        email: 'ovijitmondal08804@gmail.com',
        role: 'Super Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
        status: 'active',
        isForceLoggedOut: false,
        createdAt: '2026-01-01',
        lastLogin: new Date().toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' })
      };
      setAdminUser(superAdminUser);
      setUsers(prev => {
        const withoutOvijit = prev.filter(u => u.email.toLowerCase() !== 'ovijitmondal08804@gmail.com');
        return [superAdminUser, ...withoutOvijit];
      });
      showToast('স্বাগতম, অভিজিৎ মণ্ডল! আপনি সুপার অ্যাডমিন হিসেবে প্রবেশ করেছেন।', 'success');
      return { success: true, message: 'লগইন সফল হয়েছে।' };
    }

    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!foundUser) {
      return { success: false, message: 'এই ইমেইলটি নিবন্ধিত নয়! পরিচালকের সাথে যোগাযোগ করে অনুমতি ও পাসওয়ার্ড নিন।' };
    }
    if (foundUser.status === 'blocked') {
      return { success: false, message: 'আপনার অ্যাকাউন্টটি প্রধান অ্যাডমিন কর্তৃক সাময়িকভাবে ব্লক করা হয়েছে।' };
    }
    if (foundUser.password !== cleanPass) {
      return { success: false, message: 'ভুল পাসওয়ার্ড! আপনার নির্ধারিত পাসওয়ার্ড দিন।' };
    }

    const updatedUser = {
      ...foundUser,
      isForceLoggedOut: false,
      lastLogin: new Date().toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' })
    };
    setUsers(prev => prev.map(u => u.id === foundUser.id ? updatedUser : u));
    setAdminUser(updatedUser);
    showToast(`স্বাগতম, ${updatedUser.name}!`, 'success');
    return { success: true, message: 'লগইন সফল হয়েছে।' };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    showToast('আপনি অ্যাডমিন পোর্টাল থেকে লগআউট হয়েছেন।', 'info');
  };

  const restoreDefaultData = () => {
    setPosts(INITIAL_POSTS);
    setAdPlacements(INITIAL_AD_PLACEMENTS);
    setSiteSettings(INITIAL_SITE_SETTINGS);
    setUsers(INITIAL_ADMIN_USERS);
    setPublicUsers(INITIAL_PUBLIC_USERS);
    setCurrentPublicUser(null);
    setAccessRequests(INITIAL_ACCESS_REQUESTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setMediaItems(INITIAL_MEDIA_ITEMS);
    localStorage.clear();
    seedInitialPostsToFirestore();
    showToast('ডিফল্ট ডেটা সফলভাবে ক্লাউড ও লোকাল স্টোরেজে পুনঃস্থাপন করা হয়েছে!', 'success');
  };

  const openShareModal = (payload: ShareModalPayload) => setShareModal(payload);
  const closeShareModal = () => setShareModal(null);

  const openAccountModal = () => setAccountModalOpen(true);
  const closeAccountModal = () => setAccountModalOpen(false);

  return (
    <AppContext.Provider value={{
      currentRoute,
      navigateTo,
      categories,
      isCloudConnected,
      cloudSyncStatus,
      syncToCloudNow,
      posts,
      addPost,
      updatePost,
      deletePost,
      adPlacements,
      updateAdPlacement,
      siteSettings,
      updateSiteSettings,
      mediaItems,
      addMediaItem,
      deleteMediaItem,
      users,
      addUser,
      updateUser,
      deleteUser,
      toggleBlockUser,
      forceLogoutUser,
      publicUsers,
      currentPublicUser,
      registerPublicUser,
      loginPublicUser,
      logoutPublicUser,
      requestPremium,
      toggleBlockPublicUser,
      togglePremiumPublicUser,
      deletePublicUser,
      accessRequests,
      submitAccessRequest,
      approveAccessRequest,
      rejectAccessRequest,
      adminUser,
      loginAdmin,
      logoutAdmin,
      auditLogs,
      restoreDefaultData,
      toasts,
      showToast,
      removeToast,
      shareModal,
      openShareModal,
      closeShareModal,
      accountModalOpen,
      openAccountModal,
      closeAccountModal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
