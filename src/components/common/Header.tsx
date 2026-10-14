import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { 
  Search, 
  Menu, 
  X, 
  Shield, 
  ChevronDown, 
  Video, 
  FileText, 
  User, 
  Crown, 
  Sparkles,
  Radio
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentRoute, 
    navigateTo, 
    categories, 
    siteSettings, 
    adminUser,
    currentPublicUser,
    openAccountModal,
    posts,
    isCloudConnected
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const videoCount = posts.filter(p => p.contentType === 'video' && p.postState === 'published').length;

  const searchResults = searchQuery.trim()
    ? posts.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const navLinks = [
    { id: 'home', label: 'হোম' },
    { id: 'videos', label: 'ভিডিও', badge: videoCount > 0 ? videoCount : undefined, isVideo: true },
    { id: 'posts', label: 'সকল পোস্ট' },
    { id: 'premium', label: 'প্রিমিয়াম', isPremium: true },
    { id: 'updates', label: 'সর্বশেষ আপডেট' },
    { id: 'about', label: 'আমাদের সম্পর্কে' },
    { id: 'contact', label: 'যোগাযোগ' }
  ];

  const handleNavClick = (route: string) => {
    navigateTo(route);
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
  };

  const handleSearchSelect = (slug: string) => {
    navigateTo(`post/${slug}`);
    setShowSearchModal(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {siteSettings.announcementBar?.enabled && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-b border-emerald-500/20 px-4 py-1.5 text-xs text-emerald-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-emerald-200">ঘোষণা:</span>
              <span className="truncate text-slate-300">{siteSettings.announcementBar.text}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-medium bg-emerald-900/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>ক্লাউড লাইভ সিঙ্ক</span>
              </span>
              <button 
                onClick={() => handleNavClick('updates')}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer ml-1"
              >
                বিস্তারিত <ChevronDown className="w-3 h-3 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div 
            onClick={() => handleNavClick('home')} 
            className="cursor-pointer group flex items-center"
          >
            <Logo size="md" showTagline={true} />
          </div>

          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map(link => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 text-sm font-medium transition-colors cursor-pointer ${
                    link.isPremium
                      ? isActive 
                        ? 'text-amber-300 font-bold' 
                        : 'text-amber-400 hover:text-amber-300'
                      : isActive 
                        ? 'text-emerald-400' 
                        : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.isVideo && <Video className="w-3.5 h-3.5 text-emerald-400" />}
                    {link.isPremium && <Crown className="w-3.5 h-3.5 text-amber-400 fill-current animate-pulse" />}
                    {link.label}
                    {link.badge !== undefined && (
                      <span className="text-[11px] text-emerald-400 font-mono">
                        ({link.badge})
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                      link.isPremium ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                  )}
                </button>
              );
            })}

            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white py-1 transition-colors cursor-pointer"
              >
                <span>ক্যাটাগরি</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 shadow-xl py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    বিষয়ভিত্তিক ক্যাটাগরি
                  </div>
                  {categories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNavClick(`category/${encodeURIComponent(cat)}`)}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              title="সার্চ করুন"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleNavClick('premium')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-sm ${
                currentRoute === 'premium'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-950 ring-2 ring-amber-400/50'
                  : 'bg-gradient-to-r from-amber-950/60 to-yellow-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-900/60 hover:border-amber-400 hover:text-amber-200'
              }`}
              title="প্রিমিয়াম এক্সক্লুসিভ জোন"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-current animate-pulse" />
              <span>প্রিমিয়াম</span>
              <span className="hidden sm:inline text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                VIP
              </span>
            </button>

            <button
              onClick={openAccountModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                currentPublicUser
                  ? currentPublicUser.isPremium
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
                    : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:text-white hover:border-emerald-500/50'
              }`}
              title="ইউজার অ্যাকাউন্ট"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[90px] sm:max-w-[120px]">
                {currentPublicUser ? currentPublicUser.name : 'অ্যাকাউন্ট'}
              </span>
              {currentPublicUser?.isPremium && (
                <Crown className="w-3 h-3 text-amber-400 fill-current" />
              )}
            </button>

            <button
              onClick={() => handleNavClick(adminUser ? 'admin/dashboard' : 'admin/login')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                adminUser
                  ? 'bg-emerald-600 border border-emerald-500 text-white hover:bg-emerald-500 shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
              title="অ্যাডমিন কন্ট্রোল প্যানেল"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">
                {adminUser ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন'}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                  link.isPremium
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                    : currentRoute === link.id 
                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30' 
                      : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.isVideo && <Video className="w-4 h-4 text-emerald-400" />}
                  {link.isPremium && <Crown className="w-4 h-4 text-amber-400 fill-current" />}
                  {link.label}
                </span>
                {link.badge !== undefined && (
                  <span className="text-xs text-emerald-400 font-mono">({link.badge})</span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); openAccountModal(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentPublicUser ? currentPublicUser.name : 'অ্যাকাউন্ট'}</span>
            </button>
            <button
              onClick={() => handleNavClick(adminUser ? 'admin/dashboard' : 'admin/login')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{adminUser ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন'}</span>
            </button>
          </div>
        </div>
      )}

      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl text-slate-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <Search className="w-5 h-5 text-emerald-400" />
              <input
                type="text"
                autoFocus
                placeholder="ভিডিও বা পোস্টের শিরোনাম লিখুন..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 max-h-80 overflow-y-auto space-y-2">
              {searchResults.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  {searchQuery.trim() ? `"${searchQuery}" এর জন্য কোনো ফলাফল নেই` : 'অনুসন্ধান করতে টাইপ করুন...'}
                </div>
              ) : (
                searchResults.map(post => (
                  <div
                    key={post.id}
                    onClick={() => handleSearchSelect(post.slug)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        {post.isPremium && <Crown className="w-3 h-3 text-amber-400 fill-current" />}
                        {post.contentType === 'video' ? <Video className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3 text-slate-400" />}
                        <span>{post.category}</span>
                      </div>
                      <div className="text-xs font-medium text-white line-clamp-1">
                        {post.title}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
