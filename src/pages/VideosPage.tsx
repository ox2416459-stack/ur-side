import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdSlot } from '../components/ads/AdSlot';
import { Video, Play, Eye, Share2, Search, Radio } from 'lucide-react';

export const VideosPage: React.FC = () => {
  const { posts, navigateTo, openShareModal, isCloudConnected } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const videoPosts = posts.filter(
    p => p.contentType === 'video' && p.postState === 'published'
  );

  const filteredVideos = videoPosts.filter(v => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
          <Video className="w-4 h-4" />
          <span>ভিডিও প্রতিবেদন গ্যালারি</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-300 flex items-center gap-1 font-mono">
            <Radio className="w-3 h-3 animate-pulse" /> লাইভ ক্লাউড স্ট্রিমিং
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          সকল তথ্যচিত্র ও ভিডিও কন্টেন্ট
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          অ্যাডমিন কর্তৃক আপলোডকৃত ও নিরীক্ষিত সকল ভিডিও প্রতিবেদন সরাসরি উপভোগ করুন। যেকোনো ডিভাইস থেকে তাৎক্ষণিক লাইভ দেখা যায়।
        </p>
      </div>

      <AdSlot type="banner_header" />

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="ভিডিও শিরোনাম খুঁজুন..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {filteredVideos.length === 0 ? (
        <div className="p-12 text-center text-slate-500 border border-slate-800 rounded-2xl bg-slate-900/40">
          কোনো ভিডিও কন্টেন্ট পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <article
              key={video.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between group shadow-md"
            >
              <div 
                onClick={() => navigateTo(`post/${video.slug}`)}
                className="relative h-48 overflow-hidden bg-slate-950 cursor-pointer"
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>
                {video.videoDuration && (
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                    {video.videoDuration}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="text-emerald-400 font-medium">{video.category}</span>
                    <span>·</span>
                    <span>{video.publishedDate}</span>
                  </div>

                  <h3
                    onClick={() => navigateTo(`post/${video.slug}`)}
                    className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2"
                  >
                    {video.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{video.viewsCount} বার দেখা হয়েছে</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openShareModal({
                        title: video.title,
                        url: `post/${video.slug}`,
                        description: video.description,
                        image: video.thumbnailUrl
                      })}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      title="শেয়ার"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigateTo(`post/${video.slug}`)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
                    >
                      ভিডিও দেখুন
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
