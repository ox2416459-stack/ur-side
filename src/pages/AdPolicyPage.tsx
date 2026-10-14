import React from 'react';
import { Eye } from 'lucide-react';

export const AdPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
          <Eye className="w-3.5 h-3.5" />
          <span>বিজ্ঞাপন ও মনিটাইজেশন নীতি</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          বিজ্ঞাপন নীতি (Advertising Policy)
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          Adsterra ও স্পন্সর বিজ্ঞাপন পরিচালনার নীতিমালা
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">১. বিজ্ঞাপন প্রদর্শনের উদ্দেশ্য</h2>
          <p>
            নতুন কাজের সূত্র একটি উন্মুক্ত পোর্টাল। ব্যবহারকারীদের বিনামূল্যে কনটেন্ট পরিবেশন অব্যাহত রাখার লক্ষ্যে আমরা অনুমোদিত বিজ্ঞাপন নেটওয়ার্ক (যেমন Adsterra) এবং সরাসরি অংশীদার স্পন্সর ব্যানার প্রদর্শন করে থাকি।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">২. নিষিদ্ধ বিজ্ঞাপন সামগ্রী</h2>
          <p>
            আমরা কঠোরভাবে কোনো জুয়া, আর্থিক প্রতারণা, অবৈধ ক্রিপ্টোকারেন্সি স্কিম, পর্নোগ্রাফি বা ঘৃণ্য বিষয়বস্তুর বিজ্ঞাপন অনুমোদন করি না।
          </p>
        </section>
      </div>
    </div>
  );
};
