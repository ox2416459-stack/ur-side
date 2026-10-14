import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/common/Logo';
import { 
  LayoutDashboard, 
  Video, 
  Megaphone, 
  Settings, 
  Image as ImageIcon, 
  ShieldCheck, 
  Rocket, 
  LogOut, 
  ExternalLink, 
  ChevronRight, 
  Menu, 
  X,
  Radio
} from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, children }) => {
  const { adminUser, logoutAdmin, navigateTo, accessRequests, publicUsers, isCloudConnected, cloudSyncStatus } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const pendingCount = accessRequests.filter(r => r.status === 'pending').length;
  const premiumPendingCount = publicUsers.filter(u => u.premiumRequested && !u.isPremium).length;
  const totalAlertBadge = pendingCount + premiumPendingCount;

  const navItems = [
    { id: 'admin/dashboard', label: 'ড্যাশবোর্ড ওভারভিউ', icon: LayoutDashboard },
    { id: 'admin/posts', label: 'ভিডিও ও পোস্ট আপলোড', icon: Video },
    { 
      id: 'admin/security', 
      label: 'ইউজার অ্যাকাউন্ট ও প্রিমিয়াম', 
      icon: ShieldCheck, 
      badge: totalAlertBadge > 0 ? totalAlertBadge : undefined 
    },
    { id: 'admin/ads', label: 'Adsterra বিজ্ঞাপন', icon: Megaphone },
    { id: 'admin/settings', label: 'ওয়েবসাইট সেটিংস', icon: Settings },
    { id: 'admin/media', label: 'মিডিয়া লাইব্রেরি', icon: ImageIcon },
    { id: 'admin/deployment', label: 'Netlify ডেপ্লয়মেন্ট সেন্টার', icon: Rocket, highlight: true }
  ];

  const handleNav = (tabId: string) => {
    navigateTo(tabId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
        <Logo size="sm" showTagline={false} />
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <aside className={`
        fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between p-4 backdrop-blur-md transition-transform duration-200
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          <div className="px-2 pt-2 cursor-pointer" onClick={() => navigateTo('home')}>
            <Logo size="sm" showTagline={true} />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <img
              src={adminUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'}
              alt={adminUser?.name}
              className="w-9 h-9 rounded-full object-cover border border-emerald-500/40"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{adminUser?.name}</div>
              <div className="text-[11px] text-emerald-400 truncate">{adminUser?.role}</div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>ক্লাউড লাইভ সিঙ্ক</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              {cloudSyncStatus === 'syncing' ? 'সিঙ্ক হচ্ছে...' : 'Active'}
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : item.highlight
                        ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-800">
          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>লাইভ ওয়েবসাইট দেখুন</span>
          </button>

          <button
            onClick={() => { logoutAdmin(); navigateTo('home'); }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-950/40 border border-red-500/20 hover:bg-red-900/40 text-red-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
