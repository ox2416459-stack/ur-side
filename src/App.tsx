import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SocialShareModal } from './components/common/SocialShareModal';
import { AccountModal } from './components/common/AccountModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { VideosPage } from './pages/VideosPage';
import { PostsPage } from './pages/PostsPage';
import { PremiumPage } from './pages/PremiumPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { LatestUpdatesPage } from './pages/LatestUpdatesPage';
import { CategoryPage } from './pages/CategoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdPolicyPage } from './pages/AdPolicyPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Components
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminPosts } from './admin/AdminPosts';
import { AdminSecurity } from './admin/AdminSecurity';
import { AdminAds } from './admin/AdminAds';
import { AdminSettings } from './admin/AdminSettings';
import { AdminMedia } from './admin/AdminMedia';
import { AdminDeployment } from './admin/AdminDeployment';

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { currentRoute, adminUser } = useApp();

  // Admin routing check
  if (currentRoute.startsWith('admin')) {
    if (!adminUser) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center">
          <AdminLogin />
        </div>
      );
    }

    let adminContent: React.ReactNode = <AdminDashboard />;
    if (currentRoute === 'admin/posts') adminContent = <AdminPosts />;
    else if (currentRoute === 'admin/security') adminContent = <AdminSecurity />;
    else if (currentRoute === 'admin/ads') adminContent = <AdminAds />;
    else if (currentRoute === 'admin/settings') adminContent = <AdminSettings />;
    else if (currentRoute === 'admin/media') adminContent = <AdminMedia />;
    else if (currentRoute === 'admin/deployment') adminContent = <AdminDeployment />;

    return (
      <AdminLayout activeTab={currentRoute}>
        {adminContent}
      </AdminLayout>
    );
  }

  // Public routing
  let publicContent: React.ReactNode = <HomePage />;

  if (currentRoute === 'home') {
    publicContent = <HomePage />;
  } else if (currentRoute === 'videos') {
    publicContent = <VideosPage />;
  } else if (currentRoute === 'posts') {
    publicContent = <PostsPage />;
  } else if (currentRoute === 'premium') {
    publicContent = <PremiumPage />;
  } else if (currentRoute.startsWith('post/')) {
    const slug = currentRoute.replace('post/', '');
    publicContent = <PostDetailPage slug={slug} />;
  } else if (currentRoute.startsWith('transaction/')) {
    const slug = currentRoute.replace('transaction/', '');
    publicContent = <PostDetailPage slug={slug} />;
  } else if (currentRoute === 'updates') {
    publicContent = <LatestUpdatesPage />;
  } else if (currentRoute.startsWith('category/')) {
    const categoryName = decodeURIComponent(currentRoute.replace('category/', ''));
    publicContent = <CategoryPage categoryName={categoryName} />;
  } else if (currentRoute === 'about') {
    publicContent = <AboutPage />;
  } else if (currentRoute === 'contact') {
    publicContent = <ContactPage />;
  } else if (currentRoute === 'deployment' || currentRoute === 'netlify' || currentRoute === 'download') {
    publicContent = <HomePage />;
  } else if (currentRoute === 'privacy') {
    publicContent = <PrivacyPolicyPage />;
  } else if (currentRoute === 'terms') {
    publicContent = <TermsPage />;
  } else if (currentRoute === 'ad-policy') {
    publicContent = <AdPolicyPage />;
  } else {
    publicContent = <NotFoundPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#060b18] text-slate-100">
      <Header />
      <main className="flex-1">
        {publicContent}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
      <AccountModal />
      <SocialShareModal />
      <ToastContainer />
    </AppProvider>
  );
}

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl text-xs backdrop-blur-md animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-200'
              : 'bg-slate-900/90 border-slate-700 text-slate-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 font-medium leading-relaxed">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white shrink-0 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
