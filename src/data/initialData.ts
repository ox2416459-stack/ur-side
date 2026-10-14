import { PostItem, AdPlacement, SiteSettings, AdminUser, PublicUser, AccessRequest, AuditLog, MediaItem } from '../types';

export const INITIAL_CATEGORIES = [
  'ব্যবসায়িক বিশ্লেষণ',
  'ভিডিও প্রতিবেদন',
  'প্রিমিয়াম এক্সক্লুসিভ',
  'অর্থনীতি ও বাজার',
  'প্রযুক্তি ও উদ্ভাবন',
  'আন্তর্জাতিক বাণিজ্য'
];

export const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post-1',
    slug: 'chittagong-port-supply-chain-documentary',
    title: 'চট্টগ্রাম বন্দর ও আন্তর্জাতিক সাপ্লাই চেইনের বর্তমান চিত্র — বিশেষ ভিডিও প্রতিবেদন',
    contentType: 'video',
    category: 'ভিডিও প্রতিবেদন',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoDuration: '১০:৪৫ মিনিট',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1000&auto=format&fit=crop',
    description: 'দেশের প্রধান সমুদ্রবন্দরে কনটেইনার হ্যান্ডলিং, লজিস্টিক আধুনিকায়ন ও কাস্টমস ডিজিটালাইজেশনের মাঠপর্যায়ের ভিডিও প্রতিবেদন।',
    fullContent: `চট্টগ্রাম বন্দরের টার্মিনাল আধুনিকায়ন ও অটোমেশন প্রক্রিয়ায় সাম্প্রতিক উন্নয়ন নিয়ে আমাদের এই বিশদ ভিডিও পর্যালোচনা। এতে জাহাজের গড় অবস্থানকাল হ্রাস এবং ডিজিটাল কাস্টমস চালুর প্রভাব সরাসরি তুলে ধরা হয়েছে।\n\nবন্দর কর্তৃপক্ষের নতুন ডিজিটালাইজেশন উদ্যোগের মাধ্যমে আমদানি-রপ্তানি প্রক্রিয়া আরও দ্রুত ও স্বচ্ছ হয়ে উঠেছে।`,
    tags: ['ভিডিও', 'চট্টগ্রাম বন্দর', 'লজিস্টিক', 'বাণিজ্য'],
    postState: 'published',
    isFeatured: true,
    isPremium: false,
    publishedDate: '2026-10-10',
    author: {
      name: 'অভিজিৎ মণ্ডল',
      role: 'প্রধান প্রযোজক ও সুপার অ্যাডমিন',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
    },
    viewsCount: 2450,
    updatedAt: '2026-10-10 16:30'
  },
  {
    id: 'post-premium-1',
    slug: 'exclusive-foreign-currency-forecasting-2027',
    title: 'এক্সক্লুসিভ অর্থনৈতিক পূর্বাভাস: ২০২৭ সালের মুদ্রা বাজার ও ট্রেড সিক্রেট বিশ্লেষণ [প্রিমিয়াম]',
    contentType: 'video',
    category: 'প্রিমিয়াম এক্সক্লুসিভ',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    videoDuration: '১৫:২০ মিনিট',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop',
    description: 'আন্তর্জাতিক মুদ্রা রিজার্ভ ও আসন্ন অর্থনৈতিক পরিবর্তনের অভ্যন্তরীণ তথ্য এবং এক্সক্লুসিভ ট্রেড ডাটা। এটি শুধুমাত্র অ্যাডমিন অনুমোদিত প্রিমিয়াম ব্যবহারকারীদের জন্য সংরক্ষিত।',
    fullContent: `এই বিশেষ ভিডিও প্রতিবেদনটিতে আলোচনা করা হয়েছে আন্তর্জাতিক বাণিজ্য নীতি এবং আসন্ন মুদ্রা বাজারের অস্থিরতা কীভাবে মোকাবিলা করতে হবে।\n\n### প্রিমিয়াম বিশ্লেষণ পরিধি:\n1. ডলার বনাম ইউয়ান ট্রেড ইনডেক্স এবং আমদানি এলসি কৌশল।\n2. বৃহৎ শিল্পগ্রুপের অভ্যন্তরীণ রিজার্ভ সুরক্ষা মডেল।\n3. কর ও শুল্ক কাঠামোয় সম্ভাব্য পরিবর্তনের অভ্যন্তরীণ বিশ্লেষণ।`,
    tags: ['প্রিমিয়াম', 'ভিডিও', 'মুদ্রা বাজার', 'ট্রেড সিক্রেট'],
    postState: 'published',
    isFeatured: true,
    isPremium: true,
    publishedDate: '2026-10-11',
    author: {
      name: 'অভিজিৎ মণ্ডল',
      role: 'সুপার অ্যাডমিন',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
    },
    viewsCount: 890,
    updatedAt: '2026-10-11 19:00'
  },
  {
    id: 'post-premium-2',
    slug: 'secret-wholesale-sourcing-playbook',
    title: 'শীর্ষ ব্যবসায়ীদের অভ্যন্তরীণ সাপ্লাই নেটওয়ার্ক ও সোর্সিং গোপনীয়তা [প্রিমিয়াম পোস্ট]',
    contentType: 'post',
    category: 'প্রিমিয়াম এক্সক্লুসিভ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
    description: 'চীন ও দক্ষিণ এশিয়া থেকে মধ্যস্থতাকারী ব্যতীত সরাসরি কারখানা থেকে আমদানির কৌশল ও সরবরাহকারীদের যোগাযোগ তালিকা।',
    fullContent: `বাংলাদেশের শীর্ষ আমদানিকারকদের সাথে আলোচনার ভিত্তিতে এই গোপনীয় হ্যান্ডবুকটি প্রস্তুত করা হয়েছে। এতে সরাসরি ফ্যাক্টরি যোগাযোগ, পেমেন্ট এসক্রো এবং নির্ভরযোগ্য ভেন্ডর তালিকার সংকলন রয়েছে।`,
    tags: ['প্রিমিয়াম', 'সোর্সিং', 'গোপন কৌশল', 'আমদানি'],
    postState: 'published',
    isFeatured: false,
    isPremium: true,
    publishedDate: '2026-10-09',
    author: {
      name: 'তানভীর আহমেদ',
      role: 'সিনিয়র ট্রেড অ্যানালিস্ট',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    viewsCount: 650,
    updatedAt: '2026-10-09 11:00'
  },
  {
    id: 'post-2',
    slug: 'bangladesh-ict-export-growth-analysis',
    title: 'আইসিটি ও ডিজিটাল ফ্রিল্যান্সিং খাতের নতুন দিগন্ত — অর্থনীতি পর্যালোচনা',
    contentType: 'post',
    category: 'প্রযুক্তি ও উদ্ভাবন',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    description: 'আন্তর্জাতিক বাজারে বাংলাদেশি সফটওয়্যার ফার্ম ও আইটি পেশাজীবীদের রেমিট্যান্স প্রবাহ বৃদ্ধির বাস্তবসম্মত পরিসংখ্যান ও বিশ্লেষণ।',
    fullContent: `বাংলাদেশের প্রযুক্তি খাত দিন দিন বিশ্ববাজারে শক্তিশালী অবস্থান তৈরি করছে। ক্লাউড কম্পিউটিং, ফিনটেক সলিউশনস এবং এআই অ্যাপ্লিকেশন ডেভেলপমেন্টে দেশীয় তরুণদের অংশগ্রহণ বৈদেশিক মুদ্রা অর্জনে নতুন গতি সঞ্চার করেছে।`,
    tags: ['প্রযুক্তি', 'আইটি', 'সফটওয়্যার', 'অর্থনীতি'],
    postState: 'published',
    isFeatured: true,
    isPremium: false,
    publishedDate: '2026-10-08',
    author: {
      name: 'তানভীর আহমেদ',
      role: 'সিনিয়র ট্রেড অ্যানালিস্ট',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    viewsCount: 1820,
    updatedAt: '2026-10-08 14:10'
  }
];

export const INITIAL_PUBLIC_USERS: PublicUser[] = [
  {
    id: 'pub-1',
    name: 'ফারহান চৌধুরী',
    email: 'farhan@gmail.com',
    password: 'user123',
    isPremium: true,
    isBlocked: false,
    createdAt: '2026-10-01',
    lastLogin: '২০২৬-১০-১২ ০৯:৩০ AM'
  },
  {
    id: 'pub-2',
    name: 'সাবরিনা আক্তার',
    email: 'sabrina@gmail.com',
    password: 'user123',
    isPremium: false,
    isBlocked: false,
    premiumRequested: true,
    createdAt: '2026-10-05',
    lastLogin: '২০২৬-১০-১১ ০৪:১৫ PM'
  }
];

export const INITIAL_AD_PLACEMENTS: AdPlacement[] = [
  {
    id: 'ad-header',
    name: 'হেডার শীর্ষ ব্যানার (Header Top Banner)',
    type: 'banner_header',
    description: 'মূল ওয়েবসাইটের লোগো ও মেনুবারের ঠিক নিচে প্রদর্শিত প্রিমিয়াম অ্যাড স্লট।',
    enabled: true,
    scriptCode: `<!-- Adsterra 728x90 Leaderboard Code -->
<div style="width:100%; height:90px; background:#0b1329; display:flex; align-items:center; justify-content:center; color:#10b981; font-size:12px; border:1px dashed #1e293b;">
  Adsterra Verified Header Placement (728x90)
</div>`,
    placementId: 'AD-AST-HDR-01',
    deviceTarget: 'all',
    sizeLabel: '728x90 (Desktop) / 320x50 (Mobile)',
    frequencyMinutes: 0,
    updatedAt: '2026-10-10 11:00'
  },
  {
    id: 'ad-sidebar',
    name: 'সাইডবার রেসপনসিভ ব্যানার (Sidebar Rectangle)',
    type: 'banner_sidebar',
    description: 'ভিডিও ও পোস্ট বিস্তারিত পাতার ডান পাশে প্রদর্শিত বিজ্ঞাপন।',
    enabled: true,
    scriptCode: `<!-- Adsterra 300x250 Medium Rectangle -->
<div style="width:300px; height:250px; background:#0b1329; display:flex; align-items:center; justify-content:center; color:#38bdf8; font-size:12px; border:1px dashed #1e293b; margin:auto;">
  Adsterra Sidebar Banner (300x250)
</div>`,
    placementId: 'AD-AST-SBR-02',
    deviceTarget: 'desktop',
    sizeLabel: '300x250 / 300x600',
    frequencyMinutes: 0,
    updatedAt: '2026-10-10 11:05'
  },
  {
    id: 'ad-content',
    name: 'ইন-কনটেন্ট ব্যানার (In-Content Banner)',
    type: 'banner_content',
    description: 'পোস্ট ও ভিডিও আর্টিকেলের ভেতরে প্রাসঙ্গিকভাবে স্থাপিত বিজ্ঞাপন।',
    enabled: true,
    scriptCode: `<!-- Adsterra 468x60 / Responsive Banner -->
<div style="width:100%; height:60px; background:#0b1329; display:flex; align-items:center; justify-content:center; color:#f59e0b; font-size:12px; border:1px dashed #1e293b;">
  Adsterra In-Article Native Slot
</div>`,
    placementId: 'AD-AST-CNT-03',
    deviceTarget: 'all',
    sizeLabel: '468x60 / Adaptive',
    frequencyMinutes: 0,
    updatedAt: '2026-10-10 11:10'
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'নতুন কাজের সূত্র',
  tagline: 'লাইভ ভিডিও ও বিশ্লেষণমূলক কর্মসংস্থান পোর্টাল',
  logoText: 'নতুন কাজের সূত্র',
  announcementBar: {
    enabled: true,
    text: 'ঘোষণা: নতুন কাজের সূত্র ক্লাউড ডাটাবেজের সাথে যুক্ত। যেকোনো ভিডিও বা পোস্ট আপলোড করলে বিশ্বের যেকোনো প্রান্ত বা অন্য ওয়েবসাইট থেকে সরাসরি লাইভ দেখা যাবে!',
    link: '#premium',
    type: 'info'
  },
  contactEmail: 'contact@notunkajershutro.com',
  contactPhone: '+৮৮০ ১৭০০-০০১১২২',
  officeAddress: 'লেভেল ৮, ইস্টার্ন ট্রেড সেন্টার, বিজয়নগর, ঢাকা-১০০০, বাংলাদেশ',
  facebookUrl: 'https://facebook.com/notunkajershutro',
  telegramUrl: 'https://t.me/notunkajershutro',
  youtubeUrl: 'https://youtube.com/@notunkajershutro',
  twitterUrl: 'https://twitter.com/notunkajershutro',
  metaDescription: 'নতুন কাজের সূত্র — লাইভ ভিডিও ও বিশ্লেষণমূলক পোস্ট পোর্টাল।',
  defaultOgImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
  disclaimerText: 'সতর্কীকরণ: নতুন কাজের সূত্র পোর্টালে প্রকাশিত সকল ভিডিও ও পোস্ট সংশ্লিষ্ট পরিচালকের প্রত্যক্ষ অনুমোদনে প্রকাশিত।'
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-ovijit',
    name: 'অভিজিৎ মণ্ডল (প্রধান সুপার অ্যাডমিন)',
    email: 'ovijitmondal08804@gmail.com',
    password: 'ovijit12@@##',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    status: 'active',
    isForceLoggedOut: false,
    createdAt: '2026-01-01',
    lastLogin: '২০২৬-১০-১২'
  }
];

export const INITIAL_ACCESS_REQUESTS: AccessRequest[] = [
  {
    id: 'req-1',
    name: 'রাশেদ চৌধুরী',
    email: 'rashed.media@gmail.com',
    phone: '+৮৮০ ১৮১৯-৫৫৪৪২২',
    reason: 'আমি চট্টগ্রাম ব্যুরো থেকে ভিডিও প্রতিবেদন আপলোড করতে চাই।',
    status: 'pending',
    requestedAt: '2026-10-11 15:40'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'ক্লাউড সিঙ্ক চালু',
    module: 'সিস্টেম',
    performedBy: 'অভিজিৎ মণ্ডল (Super Admin)',
    timestamp: '2026-10-12 10:00',
    details: 'ফায়ারবেস ক্লাউড ডাটাবেজ সফলভাবে সংযুক্ত হয়েছে। সকল পোস্ট এখন বিশ্বব্যাপী লাইভ দেখা যাবে।'
  }
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-1',
    name: 'port-cargo-hero.jpg',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1000&auto=format&fit=crop',
    sizeKb: 342,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-10-09'
  }
];
