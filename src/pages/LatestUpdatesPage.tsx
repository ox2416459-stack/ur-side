import React from 'react';
import { useApp } from '../context/AppContext';
import { AdSlot } from '../components/ads/AdSlot';
import { TrendingUp, Video, FileText } from 'lucide-react';

export const LatestUpdatesPage: React.FC = () => {
  const { posts, navigateTo } = useApp();

  const sortedPosts = [...posts.filter(p => p.postState === 'published')].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>দৈনিক প্রকাশনা টাইমলাইন</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          সর্বশেষ ভিডিও ও পোস্ট আপডেট
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          নতুন কাজের সূত্র প্ল্যাটফর্মে প্রকাশিত সকল ভিডিও প্রতিবেদন ও পোস্টের রিয়েল-টাইম ক্রমানুসার।
        </p>
      </div>

      <AdSlot type="banner_header" />

      <div className="relative border-l border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
        {sortedPosts.map(post => (
          <div key={post.id} className="relative group">
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-emerald-500 group-hover:bg-emerald-500 transition-colors" />

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-all shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-medium">{post.category}</span>
                  <span>·</span>
                  <span>{post.publishedDate}</span>
                </div>
                <span className="text-[11px] text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                  {post.contentType === 'video' ? <Video className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3 text-slate-400" />}
                  <span>{post.contentType === 'video' ? 'ভিডিও প্রতিবেদন' : 'পোস্ট'}</span>
                </span>
              </div>

              <h3 
                onClick={() => navigateTo(`post/${post.slug}`)}
                className="text-base font-semibold text-white hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {post.title}
              </h3>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {post.description}
              </p>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {post.viewsCount} বার দেখা হয়েছে
                </span>
                <button
                  onClick={() => navigateTo(`post/${post.slug}`)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-medium transition-colors cursor-pointer"
                >
                  {post.contentType === 'video' ? 'ভিডিও দেখুন' : 'সম্পূর্ণ পোস্ট'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdSlot type="banner_footer" />
    </div>
  );
};
