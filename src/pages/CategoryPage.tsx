import React from 'react';
import { useApp } from '../context/AppContext';
import { AdSlot } from '../components/ads/AdSlot';
import { ArrowLeft, Tag, Play, Share2 } from 'lucide-react';

interface CategoryPageProps {
  categoryName: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryName }) => {
  const { posts, navigateTo, openShareModal } = useApp();

  const categoryPosts = posts.filter(
    p => p.category === categoryName && p.postState === 'published'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <button
          onClick={() => navigateTo('posts')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল পোস্টে ফিরুন</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
          <Tag className="w-3.5 h-3.5" />
          <span>ক্যাটাগরি অনুযায়ী কন্টেন্ট</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          {categoryName}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          এই ক্যাটাগরিতে মোট {categoryPosts.length} টি ভিডিও বা প্রতিবেদন প্রকাশিত হয়েছে।
        </p>
      </div>

      <AdSlot type="banner_header" />

      {categoryPosts.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          এই ক্যাটাগরিতে বর্তমানে কোনো প্রকাশিত কন্টেন্ট নেই।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryPosts.map(post => (
            <article
              key={post.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between shadow-md"
            >
              <div 
                onClick={() => navigateTo(`post/${post.slug}`)}
                className="relative h-44 overflow-hidden bg-slate-950 cursor-pointer"
              >
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {post.contentType === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow">
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span>{post.contentType === 'video' ? 'ভিডিও' : 'পোস্ট'}</span>
                    <span>·</span>
                    <span>{post.publishedDate}</span>
                  </div>

                  <h3
                    onClick={() => navigateTo(`post/${post.slug}`)}
                    className="text-base font-semibold text-white hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2"
                  >
                    {post.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{post.viewsCount} ভিউ</span>
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
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
                    >
                      {post.contentType === 'video' ? 'ভিডিও দেখুন' : 'পড়ুন'}
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
