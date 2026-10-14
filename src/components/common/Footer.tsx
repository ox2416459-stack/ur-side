import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { 
  Send, 
  Check, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Radio
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, siteSettings, showToast, isCloudConnected } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('অনুগ্রহ করে সঠিক ইমেইল এড্রেস লিখুন।', 'error');
      return;
    }
    setSubscribed(true);
    showToast('ধন্যবাদ! নতুন কাজের সূত্র আপডেট বুলেটিনে আপনার ইমেইল সফলভাবে নিবন্ধিত হয়েছে।', 'success');
    setEmail('');
  };

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-850">
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              “নতুন কাজের সূত্র” একটি উন্মুক্ত কর্মসংস্থান ও মিডিয়া তথ্য পোর্টাল। আমাদের প্ল্যাটফর্মে অ্যাডমিন কর্তৃক আপলোডকৃত প্রতিটি ভিডিও প্রতিবেদন ও বিশ্লেষণ সরাসরি ক্লাউড ডাটাবেজ থেকে রিয়েল-টাইমে দেশ ও বিদেশের পাঠকদের কাছে লাইভ প্রদর্শিত হয়।
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>রিয়েল-টাইম ক্লাউড সিঙ্ক দ্বারা চালিত</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">গুরুত্বপূর্ণ পাতা</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => navigateTo('home')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> হোম পেইজ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('videos')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> ভিডিও প্রতিবেদন
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('posts')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> সকল পোস্ট ও প্রতিবেদন
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('updates')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> সর্বশেষ আপডেট
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('about')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> আমাদের সম্পর্কে
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">নীতিমালা ও সুরক্ষা</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => navigateTo('privacy')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> গোপনীয়তা নীতি (Privacy)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('terms')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> ব্যবহারের শর্তাবলি (Terms)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('ad-policy')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> বিজ্ঞাপন নীতি (Ads Policy)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('contact')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-500" /> যোগাযোগ ও সহায়তা
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">নিউজলেটার সাবস্ক্রিপশন</h4>
            <p className="text-xs text-slate-400">
              নতুন ভিডিও ও বিশেষ বিশ্লেষণ পোস্ট প্রকাশিত হওয়ার সাথে সাথে নোটিফিকেশন পান।
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল ঠিকানা..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>সাবস্ক্রাইব সম্পন্ন!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>সাবস্ক্রাইব করুন</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{siteSettings.officeAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{siteSettings.contactEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{siteSettings.contactPhone}</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© ২০২৬ নতুন কাজের সূত্র (Notun Kajer Shutro) — সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <a href={siteSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Facebook</a>
            <a href={siteSettings.telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Telegram</a>
            <a href={siteSettings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">YouTube</a>
            <button 
              onClick={() => navigateTo('admin/login')}
              className="hover:text-emerald-400 text-slate-400 transition-colors cursor-pointer"
            >
              অ্যাডমিন পোর্টাল
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
