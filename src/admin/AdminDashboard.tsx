import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Video, 
  FileText, 
  Users, 
  UserCheck, 
  Plus, 
  ShieldCheck, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  ArrowUpRight, 
  Crown,
  Radio,
  CloudCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    posts, 
    users, 
    publicUsers, 
    accessRequests, 
    adPlacements, 
    auditLogs, 
    navigateTo, 
    restoreDefaultData,
    isCloudConnected,
    cloudSyncStatus,
    syncToCloudNow
  } = useApp();

  const videoCount = posts.filter(p => p.contentType === 'video').length;
  const postCount = posts.filter(p => p.contentType === 'post').length;
  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const blockedUsersCount = users.filter(u => u.status === 'blocked').length;
  const pendingReqCount = accessRequests.filter(r => r.status === 'pending').length;

  const publicUsersCount = publicUsers.length;
  const premiumUsersCount = publicUsers.filter(u => u.isPremium).length;
  const premiumPendingCount = publicUsers.filter(u => u.premiumRequested && !u.isPremium).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            অ্যাডমিন ড্যাশবোর্ড ওভারভিউ
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            নতুন কাজের সূত্র ভিডিও, পোস্ট ও ব্যবহারকারী পারমিশন নিয়ন্ত্রণ কেন্দ্র
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={syncToCloudNow}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold shadow border border-emerald-500/30 transition-colors cursor-pointer"
            title="ক্লাউড ডাটাবেজে রিয়েল-টাইম সিঙ্ক"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ক্লাউড সিঙ্ক চেক</span>
          </button>
          <button
            onClick={() => navigateTo('admin/posts')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ভিডিও বা পোস্ট আপলোড</span>
          </button>
          <button
            onClick={() => navigateTo('admin/security')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-md transition-colors border border-slate-700 cursor-pointer"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>ইউজার কন্ট্রোল ({users.length})</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>অনলাইন ক্লাউড ডাটাবেজ সক্রিয় (Firebase Firestore Live)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                {cloudSyncStatus === 'syncing' ? 'সিঙ্ক হচ্ছে...' : 'Live Connected'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              অ্যাডমিন যেকোনো পোস্ট বা ভিডিও আপলোড করলে তা সরাসরি ক্লাউডে সংরক্ষিত হয় এবং Netlify বা যেকোনো ডিভাইস থেকে তাৎক্ষণিক লাইভ দেখা যায়।
            </p>
          </div>
        </div>
        <button
          onClick={syncToCloudNow}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 cursor-pointer shadow"
        >
          এখনই ক্লাউডে সিঙ্ক করুন
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ভিডিও প্রতিবেদন</span>
            <Video className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{videoCount} টি</div>
          <div className="text-[10px] text-emerald-400">সরাসরি লাইভ</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>বিশ্লেষণ পোস্ট</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{postCount} টি</div>
          <div className="text-[10px] text-slate-400">প্রকাশিত আর্টিকেল</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>পাবলিক অ্যাকাউন্ট</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{publicUsersCount} জন</div>
          <div className="text-[10px] text-slate-400">রেজিস্টার্ড ইউজার</div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>প্রিমিয়াম পারমিশন</span>
            <Crown className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">{premiumUsersCount} জন</div>
          <div className="text-[10px] text-amber-400">অনুমোদনপ্রাপ্ত এক্সেস</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>অ্যাডমিন স্টাফ</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{activeUsersCount} জন</div>
          <div className="text-[10px] text-slate-400">ব্লকড: {blockedUsersCount}</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>অ্যাক্সেস আবেদন</span>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono">{pendingReqCount} টি</div>
          <div className="text-[10px] text-slate-400">স্টাফ আবেদন</div>
        </div>
      </div>

      {premiumPendingCount > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400 fill-current" />
              <span>{premiumPendingCount} জন ব্যবহারকারী প্রিমিয়াম পারমিশন অনুমোদনের জন্য আবেদন করেছেন!</span>
            </h4>
            <p className="text-xs text-slate-300">
              তাদের অ্যাকাউন্ট পর্যালোচনা করে প্রিমিয়াম অনুমোদন প্রদান করতে ইউজার কন্ট্রোল সেকশনে যান।
            </p>
          </div>
          <button
            onClick={() => navigateTo('admin/security')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shrink-0 shadow cursor-pointer"
          >
            প্রিমিয়াম আবেদন অনুমোদন দিন
          </button>
        </div>
      )}

      {pendingReqCount > 0 && (
        <div className="rounded-2xl border border-sky-500/40 bg-sky-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>{pendingReqCount} জন নতুন স্টাফ লগইন অনুমতির জন্য আবেদন করেছেন!</span>
            </h4>
            <p className="text-xs text-slate-300">
              তাদের তথ্য পর্যালোচনা করে পাসওয়ার্ড প্রদান করতে ইউজার কন্ট্রোল সেকশনে যান।
            </p>
          </div>
          <button
            onClick={() => navigateTo('admin/security')}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            আবেদনসমূহ দেখুন ও অনুমোদন দিন
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>নেটলিফাই ডেপ্লয়মেন্ট রেডি ও ক্লাউড সিঙ্ক</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              সম্পূর্ণ সোর্স প্রজেক্ট জিপ (Deployable ZIP) প্রস্তুত
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              ভিডিও ও পোস্ট ইঞ্জিন, ইউজার ব্লক/লগআউট সিকিউরিটি এবং ফায়ারবেস ক্লাউড কানেকশন সহ সম্পূর্ণ কোডবেস সরাসরি ডাউনলোড করে নেটলিফাই-তে ডেপ্লয় করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigateTo('admin/deployment')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow cursor-pointer"
            >
              <span>ডেপ্লয়মেন্ট সেন্টারে যান</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={restoreDefaultData}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ডিফল্ট ডেটা রিসেট</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>নিরাপত্তা নীতি সক্রিয়</span>
            </div>
            <h4 className="text-sm font-semibold text-white">পরিচালকের নিয়ন্ত্রণাধিকার</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              সুপার অ্যাডমিন যেকোনো সময় যেকোনো ব্যবহারকারীকে এক ক্লিকে ব্লক বা ফোর্স লগআউট করতে পারেন। অনুমতিহীন লগইন সম্পূর্ণ নিষিদ্ধ।
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>সেশন সুরক্ষা:</span>
            <span className="text-emerald-400 font-medium">১০০% নিয়ন্ত্রিত</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>সাম্প্রতিক অডিট অ্যাক্টিভিটি</span>
          </h3>
          <button
            onClick={() => navigateTo('admin/security')}
            className="text-xs text-emerald-400 hover:underline cursor-pointer"
          >
            ইউজার ও অডিট ড্যাশবোর্ড
          </button>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {auditLogs.slice(0, 5).map(log => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="font-semibold text-white">{log.action}</span>
                  <span className="text-slate-400 font-mono">({log.module})</span>
                </div>
                <div className="text-slate-400 text-[11px]">{log.details}</div>
              </div>
              <div className="text-right text-[11px] text-slate-400 shrink-0">
                <div>{log.performedBy}</div>
                <div className="font-mono text-slate-400">{log.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
