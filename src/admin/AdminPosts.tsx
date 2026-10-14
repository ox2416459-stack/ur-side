import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PostItem, ContentType, PostState } from '../types';
import { VideoPlayer } from '../components/common/VideoPlayer';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Video, 
  FileText, 
  X, 
  Star, 
  Play, 
  Upload, 
  Crown, 
  Image as ImageIcon,
  Radio,
  Info,
  Youtube,
  Link
} from 'lucide-react';

export const AdminPosts: React.FC = () => {
  const { posts, categories, addPost, updatePost, deletePost, navigateTo, showToast, adminUser, syncToCloudNow, cloudSyncStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'video' | 'post' | 'premium'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    contentType: 'post' as ContentType,
    category: categories[0] || 'ব্যবসায়িক বিশ্লেষণ',
    videoUrl: '',
    videoDuration: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1000&auto=format&fit=crop',
    description: '',
    fullContent: '',
    tags: 'নতুন কাজের সূত্র, প্রতিবেদন',
    postState: 'published' as PostState,
    isFeatured: false,
    isPremium: false
  });

  const filteredPosts = posts.filter(p => {
    if (contentTypeFilter === 'premium') {
      if (!p.isPremium) return false;
    } else if (contentTypeFilter !== 'all') {
      if (p.contentType !== contentTypeFilter) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = (type: ContentType = 'post') => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: `content-${Date.now().toString().slice(-6)}`,
      contentType: type,
      category: type === 'video' ? 'ভিডিও প্রতিবেদন' : categories[0] || 'ব্যবসায়িক বিশ্লেষণ',
      videoUrl: type === 'video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : '',
      videoDuration: type === 'video' ? '০৫:০০ মিনিট' : '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1000&auto=format&fit=crop',
      description: '',
      fullContent: '',
      tags: 'নতুন কাজের সূত্র, প্রতিবেদন',
      postState: 'published',
      isFeatured: false,
      isPremium: false
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (post: PostItem) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      contentType: post.contentType,
      category: post.category,
      videoUrl: post.videoUrl || '',
      videoDuration: post.videoDuration || '',
      thumbnailUrl: post.thumbnailUrl,
      description: post.description,
      fullContent: post.fullContent,
      tags: post.tags.join(', '),
      postState: post.postState,
      isFeatured: post.isFeatured,
      isPremium: post.isPremium || false
    });
    setModalOpen(true);
  };

  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন।', 'error');
      return;
    }

    setUploadingFile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.86);
            setFormData(prev => ({
              ...prev,
              thumbnailUrl: optimized
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              thumbnailUrl: event.target?.result as string
            }));
          }
        } catch {
          setFormData(prev => ({
            ...prev,
            thumbnailUrl: event.target?.result as string
          }));
        }
        setUploadingFile(false);
        showToast(`গ্যালারি থেকে ছবি "${file.name}" সফলভাবে যুক্ত হয়েছে!`, 'success');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDeviceVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('অনুগ্রহ করে একটি ভিডিও ফাইল নির্বাচন করুন।', 'error');
      return;
    }

    setUploadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      const videoDataUrl = reader.result as string;

      const tempVideo = document.createElement('video');
      tempVideo.src = videoDataUrl;
      tempVideo.muted = true;
      tempVideo.playsInline = true;
      tempVideo.currentTime = 0.5;

      tempVideo.onloadeddata = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = tempVideo.videoWidth || 640;
          canvas.height = tempVideo.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx && canvas.width > 0 && canvas.height > 0) {
            ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
            const thumbUrl = canvas.toDataURL('image/jpeg', 0.85);
            setFormData(prev => ({
              ...prev,
              contentType: 'video',
              videoUrl: videoDataUrl,
              videoDuration: tempVideo.duration ? `${Math.floor(tempVideo.duration / 60)}:${('0' + Math.floor(tempVideo.duration % 60)).slice(-2)} মিনিট` : 'ভিডিও ফাইল',
              thumbnailUrl: thumbUrl
            }));
            setUploadingFile(false);
            showToast(`গ্যালারি থেকে ভিডিও "${file.name}" যুক্ত হয়েছে!`, 'success');
            return;
          }
        } catch {}

        setFormData(prev => ({
          ...prev,
          contentType: 'video',
          videoUrl: videoDataUrl,
          videoDuration: 'ভিডিও ফাইল'
        }));
        setUploadingFile(false);
        showToast(`গ্যালারি থেকে ভিডিও "${file.name}" যুক্ত হয়েছে!`, 'success');
      };

      tempVideo.onerror = () => {
        setFormData(prev => ({
          ...prev,
          contentType: 'video',
          videoUrl: videoDataUrl,
          videoDuration: 'ভিডিও ফাইল'
        }));
        setUploadingFile(false);
        showToast(`গ্যালারি থেকে ভিডিও "${file.name}" যুক্ত হয়েছে!`, 'success');
      };
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      showToast('অনুগ্রহ করে শিরোনাম এবং স্লাগ পূরণ করুন।', 'error');
      return;
    }

    const tagArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const isVideo = formData.contentType === 'video';
    const cleanVideoUrl = isVideo ? (formData.videoUrl?.trim() || '') : '';
    const cleanVideoDuration = isVideo ? (formData.videoDuration?.trim() || '') : '';

    if (editingPost) {
      await updatePost(editingPost.id, {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        contentType: formData.contentType,
        category: formData.category,
        videoUrl: cleanVideoUrl,
        videoDuration: cleanVideoDuration,
        thumbnailUrl: formData.thumbnailUrl?.trim() || '',
        description: formData.description?.trim() || '',
        fullContent: formData.fullContent?.trim() || '',
        tags: tagArray,
        postState: formData.postState,
        isFeatured: Boolean(formData.isFeatured),
        isPremium: Boolean(formData.isPremium)
      });
    } else {
      await addPost({
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        contentType: formData.contentType,
        category: formData.category,
        videoUrl: cleanVideoUrl,
        videoDuration: cleanVideoDuration,
        thumbnailUrl: formData.thumbnailUrl?.trim() || '',
        description: formData.description?.trim() || '',
        fullContent: formData.fullContent?.trim() || '',
        tags: tagArray,
        postState: formData.postState,
        isFeatured: Boolean(formData.isFeatured),
        isPremium: Boolean(formData.isPremium),
        publishedDate: new Date().toISOString().slice(0, 10),
        author: {
          name: adminUser ? adminUser.name : 'অভিজিৎ মণ্ডল (সুপার অ্যাডমিন)',
          role: adminUser ? adminUser.role : 'Super Admin',
          avatar: adminUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
        }
      });
    }

    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ক্লাউড লাইভ ব্রডকাস্টার</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ভিডিও ও পোস্ট আপলোড কেন্দ্র
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            এখানে আপলোড করা প্রতিটি ভিডিও বা ছবি ক্লাউড ডাটাবেজে যুক্ত হয়ে সাথে সাথে যেকোনো মানুষ বা ওয়েবসাইটে লাইভ দেখা যাবে।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={syncToCloudNow}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold shadow border border-emerald-500/30 transition-colors cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ক্লাউডে সিঙ্ক ({cloudSyncStatus})</span>
          </button>
          <button
            onClick={() => handleOpenAdd('video')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>+ নতুন ভিডিও আপলোড</span>
          </button>
          <button
            onClick={() => handleOpenAdd('post')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-md transition-colors border border-slate-700 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>+ নতুন পোস্ট লিখুন</span>
          </button>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>ভিডিও পরামর্শ:</strong> ভিডিও লাইভ করার সবচেয়ে কার্যকর ও দ্রুততম মাধ্যম হলো YouTube বা Vimeo বা Cloudinary লিংক ব্যবহার করা (YouTube-এ আনলিস্টেড বা পাবলিক করে সেই লিংক এখানে দিলে নেটলিফাই সাইটে লক্ষ লক্ষ মানুষ কোনো বাফারিং ছাড়া এইচডি কোয়ালিটিতে দেখতে পারবে)।
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="পোস্ট বা ভিডিওর শিরোনাম খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'সকল কন্টেন্ট' },
            { id: 'video', label: 'ভিডিওসমূহ' },
            { id: 'post', label: 'নিয়মিত পোস্ট' },
            { id: 'premium', label: '👑 প্রিমিয়াম' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setContentTypeFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                contentTypeFilter === tab.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="p-4">কন্টেন্ট ও শিরোনাম</th>
              <th className="p-4">টাইপ</th>
              <th className="p-4">অ্যাক্সেস স্তর</th>
              <th className="p-4">ক্যাটাগরি</th>
              <th className="p-4">অবস্থা</th>
              <th className="p-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  কোনো কন্টেন্ট পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              filteredPosts.map(post => (
                <tr key={post.id} className="hover:bg-slate-855/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-950 shrink-0">
                        <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        {post.contentType === 'video' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-white line-clamp-1 max-w-sm">{post.title}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          {post.isFeatured && (
                            <span className="text-amber-400 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-current" /> ফিচার্ড
                            </span>
                          )}
                          <span>ভিউ: {post.viewsCount}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-mono flex items-center gap-1 w-fit">
                      {post.contentType === 'video' ? <Video className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3 text-slate-400" />}
                      <span>{post.contentType === 'video' ? 'ভিডিও' : 'পোস্ট'}</span>
                    </span>
                  </td>

                  <td className="p-4">
                    {post.isPremium ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 w-fit">
                        <Crown className="w-3.5 h-3.5 fill-current" />
                        <span>প্রিমিয়াম (Locked)</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400 font-medium">
                        উন্মুক্ত (Public)
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-white font-medium">{post.category}</td>

                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      post.postState === 'published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {post.postState === 'published' ? 'লাইভ (Live)' : 'খসড়া'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigateTo(`post/${post.slug}`)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        title="লাইভ দেখুন"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-800/40 cursor-pointer"
                        title="সম্পাদনা"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(post.id)}
                        className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 hover:bg-red-800/40 cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">পোস্টটি মুছে ফেলতে নিশ্চিত?</h3>
            <p className="text-xs text-slate-300">এটি ক্লাউড ডাটাবেজ ও লাইভ ওয়েবসাইট থেকে অপসারিত হবে।</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 bg-slate-800 text-xs rounded-xl text-slate-300 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 bg-red-600 text-xs rounded-xl text-white font-semibold cursor-pointer"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl my-8 rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">
                  {editingPost ? 'কন্টেন্ট সম্পাদনা (Cloud Live)' : formData.contentType === 'video' ? 'নতুন ভিডিও আপলোড (Cloud Live)' : 'নতুন পোস্ট তৈরি (Cloud Live)'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">কন্টেন্ট ধরন (Type)</label>
                  <select
                    value={formData.contentType}
                    onChange={e => setFormData({ ...formData, contentType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="video">ভিডিও প্রতিবেদন (Video)</option>
                    <option value="post">বিশ্লেষণমূলক পোস্ট (Article)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">ক্যাটাগরি</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ভিডিও বা পোস্টের শিরোনাম লিখুন..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">স্লাগ (URL Slug) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">প্রকাশনা অবস্থা</label>
                  <select
                    value={formData.postState}
                    onChange={e => setFormData({ ...formData, postState: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="published">সরাসরি লাইভ (Published to Cloud)</option>
                    <option value="draft">খসড়া (Draft)</option>
                  </select>
                </div>
              </div>

              {formData.contentType === 'video' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span>ভিডিও লিংক (YouTube / Vimeo / Direct Cloud Video)</span>
                    </span>
                    <span className="text-[11px] text-emerald-400">লাইভ ব্রডকাস্ট সমর্থিত</span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    ইউটিউব (YouTube) বা যেকোনো অনলাইন ভিডিওর লিংক এখানে দিন। সব দর্শক সরাসরি ক্লিক করেই ভিডিও দেখতে পারবে।
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.videoUrl}
                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=... অথবা ভিডিও লিংক"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.videoDuration}
                        onChange={e => setFormData({ ...formData, videoDuration: e.target.value })}
                        placeholder="সময়কাল (উদাঃ ১০:৪৫)"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-[11px]"
                      />
                    </div>
                    {formData.videoUrl && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900 border border-sky-500/30 space-y-1 col-span-3">
                        <span className="text-[11px] text-sky-400 font-semibold block">ভিডিও প্রিভিউ:</span>
                        <div className="max-w-xs aspect-video rounded-lg overflow-hidden bg-black">
                          <VideoPlayer
                            url={formData.videoUrl}
                            thumbnailUrl={formData.thumbnailUrl}
                            title={formData.title}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs text-emerald-400">
                    <Upload className="w-4 h-4" />
                    <span>ডাইরেক্ট গ্যালারি / ডিভাইস থেকে ফাইল আপলোড</span>
                  </span>
                  <span className="text-[11px] text-slate-400">ছবি বা ভিডিও ফাইল বেছে নিন</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="file"
                      ref={imageFileInputRef}
                      onChange={handleDeviceImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageFileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-xl border border-dashed border-emerald-500/50 bg-slate-950 hover:bg-slate-900 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <span>গ্যালারি থেকে ছবি বেছে নিন</span>
                    </button>
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      onChange={handleDeviceVideoUpload}
                      accept="video/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-xl border border-dashed border-sky-500/50 bg-slate-950 hover:bg-slate-900 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Video className="w-4 h-4 text-sky-400" />
                      <span>গ্যালারি থেকে ভিডিও ফাইল বেছে নিন</span>
                    </button>
                  </div>
                </div>

                {uploadingFile && (
                  <div className="text-[11px] text-amber-300 animate-pulse text-center">
                    ফাইল প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  থাম্বনেইল / কভার ইমেজ
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.thumbnailUrl}
                    onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="ছবির লিংক অথবা সরাসরি গ্যালারি থেকে সিলেক্ট করুন..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-[11px]"
                  />
                  {formData.thumbnailUrl && (
                    <img 
                      src={formData.thumbnailUrl} 
                      alt="Preview" 
                      className="w-14 h-10 rounded-lg object-cover border border-emerald-500/50 shrink-0" 
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="সংক্ষেপে পাঠকদের জন্য বর্ণনা লিখুন..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">বিস্তারিত প্রতিবেদন / কন্টেন্ট</label>
                <textarea
                  rows={6}
                  value={formData.fullContent}
                  onChange={e => setFormData({ ...formData, fullContent: e.target.value })}
                  placeholder="সম্পূর্ণ প্রতিবেদন বা ভিডিও ট্রান্সক্রিপ্ট লিখুন..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">ট্যাগসমূহ</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPremium}
                      onChange={e => setFormData({ ...formData, isPremium: e.target.checked })}
                      className="rounded bg-slate-950 border-amber-500 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Crown className="w-4 h-4 fill-current" />
                      <span>এটি প্রিমিয়াম এক্সক্লুসিভ কন্টেন্ট হিসেবে চিহ্নিত করুন (Only VIP Users can view)</span>
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-900">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="featuredCheck" className="text-slate-300 cursor-pointer text-[11px]">
                    হোমপেজে ফিচার্ড হিসেবে প্রদর্শন করুন
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>ক্লাউডে সেভ ও লাইভ প্রকাশ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
