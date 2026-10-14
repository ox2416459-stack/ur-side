import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdSlot } from '../components/ads/AdSlot';
import { FileText, Play, Search, Eye, Share2 } from 'lucide-react';

export const PostsPage: React.FC = () => {
  const { posts, categories, navigateTo, openShareModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'video' | 'post'>('all');

  const published = posts.filter(p => p.postState === 'published');

  const filtered = published.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (contentTypeFilter !== 'all' && p.contentType !== contentTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
          <FileText className="w-4 h-4" />
          <span>কন্টেন্ট ও প্রকাশনা আর্কাইভ</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          সকল কন্টেন্ট ও বিশ্লেষণমূলক পোস্ট
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          অ্যাডমিন কর্তৃক লাইভ প্রকাশিত সকল ভিডিও এবং পোস্টের সমন্বিত তালিকা।
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="শিরোনাম বা বিবরণ লিখুন..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px]">কন্টেন্ট টাইপ:</span>
          {[
            { id: 'all', label: 'সকল কন্টেন্ট' },
            { id: 'video', label: 'কেবল ভিডিও' },
            { id: 'post', label: 'কেবল পোস্ট' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setContentTypeFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                contentTypeFilter === tab.id
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AdSlot type="banner_header" />

      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500 border border-slate-800 rounded-2xl bg-slate-900/40">
          কোনো কন্টেন্ট পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between shadow-md"
            >
              <div 
                onClick={() => navigateTo(`post/${item.slug}`)}
                className="relative h-48 overflow-hidden bg-slate-950 cursor-pointer"
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                {item.contentType === 'video' ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                    {item.videoDuration && (
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                        {item.videoDuration}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-slate-300 font-medium">
                    প্রতিবেদন
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="text-emerald-400 font-medium">{item.category}</span>
                    <span>·</span>
                    <span>{item.publishedDate}</span>
                  </div>

                  <h3
                    onClick={() => navigateTo(`post/${item.slug}`)}
                    className="text-base font-semibold text-white hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2"
                  >
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.viewsCount} বার দেখা হয়েছে</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openShareModal({
                        title: item.title,
                        url: `post/${item.slug}`,
                        description: item.description,
                        image: item.thumbnailUrl
                      })}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      title="শেয়ার"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigateTo(`post/${item.slug}`)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
                    >
                      {item.contentType === 'video' ? 'ভিডিও দেখুন' : 'বিস্তারিত পড়ুন'}
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
