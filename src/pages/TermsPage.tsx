import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
          <FileText className="w-3.5 h-3.5" />
          <span>ব্যবহারের নিয়ম ও আইনি বাধ্যবাধকতা</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          ব্যবহারের শর্তাবলি (Terms & Conditions)
        </h1>
        <p className="mt-2 text-xs text-slate-400">
          সর্বশেষ সংস্করণ: অক্টোবর ২০২৬
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">১. গ্রহণযোগ্য ব্যবহার নীতি</h2>
          <p>
            নতুন কাজের সূত্র পোর্টাল ব্যবহারের মাধ্যমে আপনি স্বীকার করছেন যে আপনি কোনো বেআইনি উদ্দেশ্যে, বিভ্রান্তিকর তথ্য ছড়ানো বা সিস্টেমের তথ্যাদি অবৈধভাবে স্ক্র্যাপ করার চেষ্টা করবেন না।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">২. দায় অস্বীকার</h2>
          <p>
            পোর্টালে প্রকাশিত ভিডিও এবং প্রতিবেদনের তথ্য সাধারণ অবগতি ও বিশ্লেষণের উদ্দেশ্যে প্রস্তুত।
          </p>
        </section>
      </div>
    </div>
  );
};
