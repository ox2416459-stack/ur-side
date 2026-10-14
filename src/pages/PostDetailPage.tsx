import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdSlot } from '../components/ads/AdSlot';
import { VideoPlayer } from '../components/common/VideoPlayer';
import { 
  ArrowLeft, 
  Share2, 
  Eye, 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  Copy, 
  Check, 
  Crown, 
  Lock, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

interface PostDetailPageProps {
  slug: string;
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({ slug }) => {
  const { 
    posts, 
    currentPublicUser, 
    adminUser, 
    openAccountModal, 
    requestPremium, 
    navigateTo, 
    openShareModal, 
    showToast 
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);

  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">কন্টেন্টটি খুঁজে পাওয়া যায়নি</h2>
        <p className="text-xs text-slate-400">অনুরোধকৃত ভিডিও বা পোস্টটি সরানো হয়েছে অথবা ভুল লিংক।</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium cursor-pointer"
        >
          হোম পেইজে ফিরে যান
        </button>
      </div>
    );
  }

  const canView = !post.isPremium || currentPublicUser?.isPremium || !!adminUser;

  const related = posts.filter(
    p => p.category === post.category && p.id !== post.id && p.postState === 'published'
  ).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('লিংক কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo(post.isPremium ? 'premium' : 'home')}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{post.isPremium ? 'প্রিমিয়াম জোনে ফিরুন' : 'পূর্বের পাতায় ফিরে যান'}</span>
        </button>

        <div className="flex items-center gap-2">
          {post.isPremium && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>প্রিমিয়াম কন্টেন্ট</span>
            </span>
          )}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
          </button>
          <button
            onClick={() => openShareModal({
              title: post.title,
              url: `post/${post.slug}`,
              description: post.description,
              image: post.thumbnailUrl
            })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition-colors shadow cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>ফেসবুকে শেয়ার</span>
          </button>
        </div>
      </div>

      {!canView ? (
        <div className="max-w-3xl mx-auto rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-950 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>প্রিমিয়াম এক্সক্লুসিভ পোস্ট</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-white">
              {post.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed pt-1">
              এই ভিডিও বা পোস্টটি সম্পূর্ণ দেখতে অ্যাডমিন কর্তৃক প্রিমিয়াম পারমিশন সক্রিয় থাকতে হবে।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!currentPublicUser ? (
              <button
                onClick={openAccountModal}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Crown className="w-4 h-4 fill-current" />
                <span>লগইন বা অ্যাকাউন্ট তৈরি করুন</span>
              </button>
            ) : currentPublicUser.premiumRequested ? (
              <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-300 text-xs font-medium">
                ✓ আপনার প্রিমিয়াম পারমিশন আবেদন পরিচালকের অনুমোদনের অপেক্ষায় রয়েছে।
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
              ফিরে যান
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <span className="text-emerald-400 font-semibold">{post.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  {post.contentType === 'video' ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                  {post.contentType === 'video' ? 'ভিডিও প্রতিবেদন' : 'বিশ্লেষণমূলক পোস্ট'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{post.publishedDate}</span>
                {post.videoDuration && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400 font-mono">{post.videoDuration}</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                {post.title}
              </h1>

              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {post.description}
              </p>
            </div>

            {post.contentType === 'video' ? (
              <VideoPlayer
                url={post.videoUrl}
                thumbnailUrl={post.thumbnailUrl}
                title={post.title}
              />
            ) : (
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl max-h-96">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <AdSlot type="banner_content" />

            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 pt-2">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                বিস্তারিত বিবরণ ও পর্যালোচনা
              </h3>
              <div className="whitespace-pre-line text-slate-300">
                {post.fullContent}
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-800 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400">ট্যাগসমূহ:</span>
                {post.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 flex items-center gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-700"
              />
              <div>
                <div className="text-xs text-emerald-400">প্রকাশক ও উপস্থাপক</div>
                <div className="text-sm font-semibold text-white">{post.author.name}</div>
                <div className="text-xs text-slate-400">{post.author.role} — নতুন কাজের সূত্র</div>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <AdSlot type="banner_sidebar" />

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <h4 className="text-sm font-semibold text-white">সোশ্যাল মিডিয়ায় শেয়ার করুন</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ফেসবুক ও অন্যান্য সোশ্যাল চ্যানেলে এই প্রতিবেদনটি শেয়ার করতে নিচের বোতাম ব্যবহার করুন।
              </p>
              <button
                onClick={() => openShareModal({
                  title: post.title,
                  url: `post/${post.slug}`,
                  description: post.description,
                  image: post.thumbnailUrl
                })}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>ফেসবুক ও সোশ্যাল শেয়ার</span>
              </button>
            </div>

            {related.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <h4 className="text-sm font-semibold text-white">সম্পর্কিত কন্টেন্ট</h4>
                <div className="space-y-3">
                  {related.map(r => (
                    <div
                      key={r.id}
                      onClick={() => navigateTo(`post/${r.slug}`)}
                      className="group cursor-pointer space-y-1 pb-3 border-b border-slate-800/80 last:border-0 last:pb-0"
                    >
                      <div className="text-[11px] text-emerald-400">{r.category} · {r.publishedDate}</div>
                      <h5 className="text-xs font-medium text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {r.title}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};
