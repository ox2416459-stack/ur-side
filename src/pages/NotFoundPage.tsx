import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mx-auto shadow-lg">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono text-emerald-400">ERROR 404</span>
        <h1 className="text-3xl font-bold text-white">পাতাটি খুঁজে পাওয়া যায়নি</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
          আপনি যে ঠিকানাটি খুঁজছেন তা মুছে ফেলা হয়েছে, স্থানান্তরিত হয়েছে অথবা ভুল টাইপ করা হয়েছে।
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer shadow"
        >
          <Home className="w-4 h-4" />
          <span>হোম পেইজে যান</span>
        </button>
        <button
          onClick={() => navigateTo('posts')}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল পোস্ট দেখুন</span>
        </button>
      </div>
    </div>
  );
};
