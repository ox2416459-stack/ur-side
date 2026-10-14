import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
          <Shield className="w-3.5 h-3.5" />
          <span>আইনি ও ডেটা সুরক্ষা নীতিমালা</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          গোপনীয়তা নীতি (Privacy Policy)
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          সর্বশেষ সংস্করণ ও কার্যকর তারিখ: ১২ অক্টোবর ২০২৬
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">১. ভূমিকা ও তথ্যের পরিধি</h2>
          <p>
            “নতুন কাজের সূত্র” (Notun Kajer Shutro) পোর্টালে আপনার তথ্যের গোপনীয়তা রক্ষা করা আমাদের অন্যতম প্রধান দায়িত্ব। এই গোপনীয়তা নীতিমালায় ব্যাখ্যা করা হয়েছে আমরা কীভাবে ব্যবসায়িক ভিডিও প্রতিবেদন ও তথ্য সংগ্রহ, যাচাই ও প্রকাশ করি এবং সাধারণ ভিজিটরদের ব্রাউজিং ডেটা সংরক্ষণ করি।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">২. কুকিজ এবং তৃতীয় পক্ষের ট্র্যাকিং</h2>
          <p>
            আমাদের ওয়েবসাইট ব্যবহারকারীর পছন্দ সংরক্ষণ এবং সাইট বিশ্লেষণের জন্য কুকিজ ব্যবহার করে থাকে। তৃতীয় পক্ষের বিজ্ঞাপন নেটওয়ার্ক (যেমন Adsterra) প্রাসঙ্গিক বিজ্ঞাপন পরিবেশনের স্বার্থে কুকি ব্যবহার করতে পারে।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">৩. যোগাযোগ ও অভিযোগ</h2>
          <p>
            গোপনীয়তা নীতি সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের ইমেইলে যোগাযোগ করুন: <strong>privacy@notunkakershutro.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
};
