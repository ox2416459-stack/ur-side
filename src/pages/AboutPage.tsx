import React from 'react';
import { useApp } from '../context/AppContext';
import { AdSlot } from '../components/ads/AdSlot';
import { ShieldCheck, Target, Award, Radio } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="max-w-3xl">
        <div className="text-xs text-emerald-400 font-medium mb-1">আমাদের পরিচিতি ও লক্ষ্য</div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          “নতুন কাজের সূত্র” — স্বচ্ছ তথ্যের পথিকৃৎ
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
          বাংলাদেশের দ্রুত বর্ধনশীল অনলাইন পরিমণ্ডলে সঠিক, নিরপেক্ষ ও যাচাইকৃত ভিডিও এবং বিশ্লেষণধর্মী প্রতিবেদন পরিবেশন করাই আমাদের মূল অঙ্গীকার। আমাদের প্ল্যাটফর্ম সরাসরি ক্লাউড ডাটাবেজে চালিত, যা যেকোনো স্থান থেকে তাৎক্ষণিক দেখা যায়।
        </p>
      </div>

      <AdSlot type="banner_header" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">আমাদের উদ্দেশ্য</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            জনস্বার্থ, বাণিজ্য, তথ্যপ্রযুক্তি এবং দৈনন্দিন গুরুত্বপূর্ণ ঘটনাবলীর বস্তুনিষ্ঠ ভিডিও প্রতিবেদন ও বিশ্লেষণ একটি উন্মুক্ত প্ল্যাটফর্মে উপস্থাপন করা।
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">যাচাইকরণ প্রক্রিয়া</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            প্রতিটি প্রতিবেদন প্রকাশের পূর্বে আমাদের অভিজ্ঞ এডিটরিয়াল টিম তথ্যের সত্যতা নিশ্চিত করে অ্যাডমিন প্যানেল থেকে প্রকাশ করে।
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">স্বচ্ছতা ও ক্লাউড প্রযুক্তি</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ক্লাউড ডেপ্লয়মেন্টের কারণে প্রতিটি ভিডিও বা পোস্ট প্রকাশের সাথে সাথে পৃথিবীর সকল প্রান্তের পাঠকরা তাৎক্ষণিকভাবে দেখতে পারেন।
          </p>
        </div>
      </div>
    </div>
  );
};
