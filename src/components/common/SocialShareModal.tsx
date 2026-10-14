import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  MessageSquare, 
  Send, 
  Info 
} from 'lucide-react';

export const SocialShareModal: React.FC = () => {
  const { shareModal, closeShareModal, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModal) return null;

  const currentUrl = shareModal.url.startsWith('http') 
    ? shareModal.url 
    : `https://notunkakershutro.netlify.app${shareModal.url.startsWith('/') ? '' : '/'}${shareModal.url}`;

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(shareModal.title);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
  const metaDebuggerUrl = `https://developers.facebook.com/tools/debug/?q=${encodedUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast('লিংক কপি করা হয়েছে!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('লিংক কপি করতে ব্যর্থ হয়েছে।', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareModal.title,
          text: shareModal.description,
          url: currentUrl
        });
        showToast('শেয়ার সফল হয়েছে!', 'success');
        closeShareModal();
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">সোশ্যাল মিডিয়ায় শেয়ার করুন</h3>
              <p className="text-xs text-slate-400">ফেসবুক ও অন্যান্য মাধ্যমে প্রকাশ করুন</p>
            </div>
          </div>
          <button
            onClick={closeShareModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-slate-400 mb-1.5 block">ফেসবুক প্রিভিউ কার্ড (Open Graph Preview):</span>
          <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950/90 text-left">
            {shareModal.image ? (
              <img
                src={shareModal.image}
                alt={shareModal.title}
                className="w-full h-36 object-cover border-b border-slate-800"
              />
            ) : (
              <div className="w-full h-24 bg-gradient-to-r from-slate-900 to-emerald-950 flex items-center justify-center text-xs text-slate-400 border-b border-slate-800">
                নতুন কাজের সূত্র ব্র্যান্ড কার্ড
              </div>
            )}
            <div className="p-3">
              <p className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">NOTUNKAJERSHUTRO.NETLIFY.APP</p>
              <h4 className="text-sm font-semibold text-white line-clamp-1 mt-0.5">{shareModal.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                {shareModal.description || 'নতুন কাজের সূত্র — লাইভ ভিডিও ও বিশ্লেষণমূলক পোস্ট পোর্টাল।'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2.5 mt-5">
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-all group cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-xs font-medium">ফেসবুক</span>
          </a>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all group cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-medium">হোয়াটসঅ্যাপ</span>
          </a>

          <a
            href={telegramShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-sky-600/15 border border-sky-500/30 text-sky-400 hover:bg-sky-600 hover:text-white transition-all group cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span className="text-xs font-medium">টেলিগ্রাম</span>
          </a>

          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all group cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-xs font-medium">এক্স (টুইটার)</span>
          </a>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-transparent px-3 text-xs text-slate-300 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>লিংক কপি</span>
                </>
              )}
            </button>
          </div>
        </div>

        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            onClick={handleNativeShare}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>ডিভাইসের নেটিভ শেয়ারার ওপেন করুন</span>
          </button>
        )}

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400" /> মেটা শেয়ারিং প্রিভিউ ক্যাশ যাচাই:
          </span>
          <a
            href={metaDebuggerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <span>Meta Sharing Debugger</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
