import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdSlot } from '../components/ads/AdSlot';
import { VideoPlayer } from '../components/common/VideoPlayer';
import { 
  Play, 
  Video, 
  FileText, 
  Share2, 
  Clock, 
  ArrowUpRight, 
  ChevronRight, 
  Eye, 
  Sparkles,
  Radio
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { posts, categories, navigateTo, openShareModal, isCloudConnected } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'video' | 'post'>('all');

  const publishedPosts = posts.filter(p => p.postState === 'published');
  
  const filteredPosts = publishedPosts.filter(p => {
    if (filterType === 'video') return p.contentType === 'video';
    if (filterType === 'post') return p.contentType === 'post';
    return true;
  });

  const featuredVideo = publishedPosts.find(p => p.contentType === 'video' && p.isFeatured) || publishedPosts.find(p => p.contentType === 'video');
  const latestPosts = filteredPosts.slice(0, 6);

  return (
    <div className="space-y-12 pb-16">
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-850">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium mb-3 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>সরাসরি ক্লাউড লাইভ ডাটাবেজ — সকল ডিভাইসে তাৎক্ষণিক দৃশ্যমান</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            সত্য ও তথ্যের সমন্বয়ে নতুন দৃষ্টিভঙ্গি — <span className="text-emerald-400">নতুন কাজের সূত্র</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            এখানে প্রচারিত প্রতিটি ভিডিও তথ্যচিত্র এবং প্রতিবেদন আমাদের নিজস্ব অ্যাডমিন প্যানেল থেকে ক্লাউডে আপলোড ও রিয়েল-টাইমে লাইভ প্রচারিত।
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigateTo('videos')}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-950 flex items-center gap-2 group cursor-pointer"
            >
              <Video className="w-4 h-4 text-white" />
              <span>ভিডিও প্রতিবেদনসমূহ</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigateTo('posts')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>সকল পোস্ট ব্রাউজ করুন ({publishedPosts.length})</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot type="banner_header" />
      </div>

      {featuredVideo && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-4">
              <Sparkles className="w-4 h-4" />
              <span>স্পটলাইট ভিডিও ফিচার</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <VideoPlayer
                  url={featuredVideo.videoUrl}
                  thumbnailUrl={featuredVideo.thumbnailUrl}
                  title={featuredVideo.title}
                />
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400 font-medium">{featuredVideo.category}</span>
                  <span>·</span>
                  <span>{featuredVideo.publishedDate}</span>
                  {featuredVideo.videoDuration && (
                    <>
                      <span>·</span>
                      <span className="text-amber-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {featuredVideo.videoDuration}
                      </span>
                    </>
                  )}
                </div>

                <h2 
                  onClick={() => navigateTo(`post/${featuredVideo.slug}`)}
                  className="text-xl sm:text-2xl font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer leading-snug"
                >
                  {featuredVideo.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {featuredVideo.description}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => navigateTo(`post/${featuredVideo.slug}`)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>সম্পূর্ণ প্রতিবেদন পড়ুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openShareModal({
                      title: featuredVideo.title,
                      url: `post/${featuredVideo.slug}`,
                      description: featuredVideo.description,
                      image: featuredVideo.thumbnailUrl
                    })}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="শেয়ার করুন"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">সর্বশেষ কন্টেন্ট ও প্রতিবেদন</h2>
            <p className="text-xs text-slate-400 mt-0.5">অ্যাডমিন কর্তৃক লাইভ প্রকাশিত সাম্প্রতিক পোস্টসমূহ</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              সকল ({publishedPosts.length})
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterType === 'video' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>ভিডিও ({publishedPosts.filter(p => p.contentType === 'video').length})</span>
            </button>
            <button
              onClick={() => setFilterType('post')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterType === 'post' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>পোস্ট ({publishedPosts.filter(p => p.contentType === 'post').length})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map(post => (
            <article
              key={post.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between group shadow-md"
            >
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {post.contentType === 'video' ? (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                    {post.videoDuration && (
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                        {post.videoDuration}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] text-slate-300 font-medium">
                    প্রতিবেদন
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="text-emerald-400 font-medium">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.publishedDate}</span>
                  </div>

                  <h3
                    onClick={() => navigateTo(`post/${post.slug}`)}
                    className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2"
                  >
                    {post.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{post.viewsCount} বার পঠিত</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openShareModal({
                        title: post.title,
                        url: `post/${post.slug}`,
                        description: post.description,
                        image: post.thumbnailUrl
                      })}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      title="শেয়ার"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigateTo(`post/${post.slug}`)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-medium transition-all cursor-pointer"
                    >
                      {post.contentType === 'video' ? 'ভিডিও দেখুন' : 'বিস্তারিত পড়ুন'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot type="banner_content" />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-white mb-4">বিষয়ভিত্তিক ক্যাটাগরি</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, idx) => {
            const count = posts.filter(p => p.category === cat && p.postState === 'published').length;
            return (
              <div
                key={idx}
                onClick={() => navigateTo(`category/${encodeURIComponent(cat)}`)}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 hover:border-slate-700 cursor-pointer transition-all group"
              >
                <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                  {cat}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {count} টি কন্টেন্ট
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
