import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdSlot } from '../components/ads/AdSlot';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Clock
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteSettings, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'সাধারণ জিজ্ঞাসা',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('অনুগ্রহ করে নাম, ইমেইল এবং বার্তার বিবরণ পূরণ করুন।', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('আপনার বার্তা সফলভাবে নতুন কাজের সূত্র সাপোর্ট টিমে পৌঁছেছে!', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'সাধারণ জিজ্ঞাসা',
        message: ''
      });
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="text-xs text-emerald-400 font-medium mb-1">সাপোর্ট ও যোগাযোগ</div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          যোগাযোগ ও সাপোর্ট কেন্দ্র
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          কোনো তথ্য যাচাই করতে, মতামত জানাতে বা নতুন কোনো প্রতিবেদন সংক্রান্ত তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>বার্তা পাঠান</span>
          </h2>

          {submitted ? (
            <div className="p-8 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-semibold text-white">বার্তা সফলভাবে পাঠানো হয়েছে!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                আমাদের সংশ্লিষ্ট সাপোর্ট টিম থেকে আগামী ২৪ ঘণ্টার মধ্যে আপনার প্রদত্ত ইমেইল বা ফোনে যোগাযোগ করা হবে।
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium cursor-pointer"
              >
                আরেকটি বার্তা পাঠান
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    আপনার পূর্ণ নাম <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="উদাঃ মোঃ রফিকুল ইসলাম"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ইমেইল <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ফোন নম্বর (হোয়াটসঅ্যাপ সুবিধাসহ)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+৮৮০ ১৭০০-০০০০০০"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    বিষয়
                  </label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="সাধারণ জিজ্ঞাসা">সাধারণ জিজ্ঞাসা</option>
                    <option value="ভিডিও প্রতিবেদন সংক্রান্ত">ভিডিও প্রতিবেদন সংক্রান্ত</option>
                    <option value="বিজ্ঞাপন বা পার্টনারশিপ">বিজ্ঞাপন বা স্পন্সর পার্টনারশিপ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  বিস্তারিত বার্তা <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="আপনার বার্তা বা প্রশ্ন লিখুন..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>পাঠানো হচ্ছে...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>বার্তা পাঠান</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">সরাসরি যোগাযোগ</h3>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">প্রধান কার্যালয়:</span>
                  <span>{siteSettings.officeAddress}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white block">ইমেইল:</span>
                  <span>{siteSettings.contactEmail}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white block">হটলাইন:</span>
                  <span>{siteSettings.contactPhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white block">অফিস সময়:</span>
                  <span>রবিবার - বৃহস্পতিবার, সকাল ৯:০০ - সন্ধ্যা ৬:০০</span>
                </div>
              </div>
            </div>
          </div>

          <AdSlot type="banner_sidebar" />
        </div>
      </div>
    </div>
  );
};
