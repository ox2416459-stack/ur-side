import React from 'react';
import { useApp } from '../context/AppContext';
import { VideoPlayer } from '../components/common/VideoPlayer';
import { AdSlot } from '../components/ads/AdSlot';
import { 
  Crown, 
  Lock, 
  Sparkles, 
  Share2, 
  Eye, 
  CheckCircle2 
} from 'lucide-react';

export const PremiumPage: React.FC = () => {
  const { 
    posts, 
    currentPublicUser, 
    adminUser, 
    openAccountModal, 
    requestPremium, 
    navigateTo, 
    openShareModal 
  } = useApp();

  const isUserPremium = currentPublicUser?.isPremium || !!adminUser;
  const premiumPosts = posts.filter(p => p.isPremium && p.postState === 'published');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
              <Crown className="w-4 h-4 fill-current" />
              <span>নতুন কাজের সূত্র প্রিমিয়াম এক্সক্লুসিভ জোন</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              অ্যাডমিন নিয়ন্ত্রিত প্রিমিয়াম ভিডিও ও পোস্ট
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              শুধুমাত্র প্রধান পরিচালকের বিশেষ অনুমোদনপ্রাপ্ত প্রিমিয়াম ব্যবহারকারীদের জন্য সংরক্ষিত অভ্যন্তরীণ বাণিজ্যিক ডেটা, কৌশল ও ভিডিও প্রতিবেদন।
            </p>
          </div>

          <div className="shrink-0">
            {isUserPremium ? (
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>প্রিমিয়াম অ্যাক্সেস সক্রিয় (Unlocked)</span>
              </div>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>পারমিশন সংরক্ষিত (Locked)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isUserPremium ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              প্রিমিয়াম কন্টেন্ট দেখতে পরিচালকের অনুমতি আবশ্যক
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              {!currentPublicUser 
                ? 'প্রিমিয়াম ভিডিও ও পোস্ট দেখার জন্য প্রথমে আপনার জিমেইল দিয়ে একটি অ্যাকাউন্ট তৈরি করুন অথবা সাইন ইন করুন।'
                : 'আপনার অ্যাকাউন্টটি এখনও সাধারণ অবস্থায় রয়েছে। পরিচালকের কাছ থেকে প্রিমিয়াম পারমিশন পেলে এই পাতাটি স্বয়ংক্রিয়ভাবে আনলক হয়ে যাবে।'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!currentPublicUser ? (
              <button
                onClick={openAccountModal}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Crown className="w-4 h-4 fill-current" />
                <span>অ্যাকাউন্ট তৈরি বা সাইন ইন করুন</span>
              </button>
            ) : currentPublicUser.premiumRequested ? (
              <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>আপনার প্রিমিয়াম পারমিশন আবেদন প্রক্রিয়াধীন রয়েছে। অনুমোদনের পর দেখতে পাবেন।</span>
              </div>
            ) : (
              <button
                onClick={requestPremium}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Crown className="w-4 h-4 fill-current" />
                <span>প্রিমিয়াম পারমিশনের জন্য আবেদন পাঠান</span>
              </button>
            )}

            <button
              onClick={() => navigateTo('home')}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              মূল ওয়েবসাইটে ফিরুন
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800 text-left">
            <span className="text-xs font-semibold text-slate-400 mb-3 block">
              লকড প্রিমিয়াম কন্টেন্টের তালিকা ({premiumPosts.length} টি):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60 pointer-events-none">
              {premiumPosts.map(p => (
                <div key={p.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1">{p.title}</h4>
                    <span className="text-[10px] text-amber-400">প্রিমিয়াম পারমিশন সংরক্ষিত</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>আপনার জন্য আনলককৃত এক্সক্লুসিভ প্রিমিয়াম কন্টেন্ট</span>
              </h3>
              <p className="text-xs text-slate-400">মোট {premiumPosts.length} টি প্রিমিয়াম ভিডিও ও প্রতিবেদন উপলব্ধ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {premiumPosts.map(post => (
              <article
                key={post.id}
                className="rounded-2xl border border-amber-500/30 bg-slate-900/80 hover:border-amber-500/60 transition-all overflow-hidden flex flex-col justify-between shadow-xl"
              >
                {post.contentType === 'video' ? (
                  <div className="p-4 bg-slate-950">
                    <VideoPlayer
                      url={post.videoUrl}
                      thumbnailUrl={post.thumbnailUrl}
                      title={post.title}
                    />
                  </div>
                ) : (
                  <div className="relative h-56 bg-slate-950 overflow-hidden">
                    <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow">
                      <Crown className="w-3 h-3 fill-current" />
                      <span>প্রিমিয়াম পোস্ট</span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-400 mb-1.5 font-medium">
                      <span>{post.category}</span>
                      <span>·</span>
                      <span>{post.publishedDate}</span>
                    </div>

                    <h3
                      onClick={() => navigateTo(`post/${post.slug}`)}
                      className="text-base sm:text-lg font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {post.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {post.viewsCount} ভিউ
                    </span>

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
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                      >
                        {post.contentType === 'video' ? 'ভিডিও ও বিবরণ' : 'সম্পূর্ণ পোস্ট পড়ুন'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <AdSlot type="banner_footer" />
    </div>
  );
};
