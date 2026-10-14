import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/common/Logo';
import { 
  Shield, 
  Lock, 
  Mail, 
  KeyRound, 
  AlertCircle, 
  ArrowLeft, 
  UserCheck, 
  UserPlus, 
  Eye, 
  EyeOff,
  X 
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, submitAccessRequest, navigateTo, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqReason, setReqReason] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = loginAdmin(email, password);
    if (res.success) {
      navigateTo('admin/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim() || !reqEmail.trim() || !reqReason.trim()) {
      showToast('অনুগ্রহ করে নাম, ইমেইল এবং আবেদনের কারণ লিখুন।', 'error');
      return;
    }

    submitAccessRequest(reqName, reqEmail, reqPhone, reqReason);
    setShowRequestModal(false);
    setReqName('');
    setReqEmail('');
    setReqPhone('');
    setReqReason('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" showTagline={false} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            অ্যাডমিন এক্সেস ও নিয়ন্ত্রণ পোর্টাল
          </h2>
          <p className="text-xs text-slate-400">
            নতুন কাজের সূত্র ভিডিও ও পোস্ট ম্যানেজমেন্ট গেটওয়ে
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs text-amber-300 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-amber-400">
            <Lock className="w-4 h-4 shrink-0" />
            <span>পরিচালকের অনুমতি সাপেক্ষ প্রবেশাধিকার</span>
          </div>
          <p className="leading-relaxed text-[11px] text-amber-200/80">
            প্রধান পরিচালকের পূর্বানুমতি ও পাসওয়ার্ড অনুমোদন ব্যতীত কোনো ব্যবহারকারী ড্যাশবোর্ডে প্রবেশ করতে পারবেন না।
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                অ্যাডমিন অনুমোদিত ইমেইল
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  placeholder="ovijitmondal08804@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                গোপন পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>নিরাপদ ড্যাশবোর্ডে প্রবেশ করুন</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <span className="text-[11px] text-slate-400 block">
              আপনার কি এখনো পরিচালকের অনুমতি বা পাসওয়ার্ড নেই?
            </span>
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="w-full py-2 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>পরিচালকের সাথে যোগাযোগ ও অনুমতির জন্য আবেদন</span>
            </button>
          </div>

          <div className="pt-3 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 border-t border-slate-800/80">
            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>১০০% সুরক্ষিত ও সম্পূর্ণ গোপনীয় অ্যাডমিন গেটওয়ে</span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigateTo('home')}
            className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </button>
        </div>
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4 shadow-2xl text-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">অ্যাক্সেস অনুমতির আবেদন</h3>
              </div>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              আপনার তথ্য প্রদান করুন। প্রধান পরিচালক আবেদনটি পর্যালোচনা করে পাসওয়ার্ড নির্ধারণ ও অনুমতি প্রদান করবেন।
            </p>

            <form onSubmit={handleSubmitRequest} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">আপনার পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={reqName}
                  onChange={e => setReqName(e.target.value)}
                  placeholder="উদাঃ মোঃ রাশেদ করিম"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">ইমেইল ঠিকানা *</label>
                <input
                  type="email"
                  required
                  value={reqEmail}
                  onChange={e => setReqEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">মোবাইল বা হোয়াটসঅ্যাপ নম্বর</label>
                <input
                  type="tel"
                  value={reqPhone}
                  onChange={e => setReqPhone(e.target.value)}
                  placeholder="+৮৮০ ১৭০০-০০০০০০"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">আবেদনের কারণ ও দায়িত্ব *</label>
                <textarea
                  rows={3}
                  required
                  value={reqReason}
                  onChange={e => setReqReason(e.target.value)}
                  placeholder="আমি ভিডিও বা পোস্ট কন্টেন্ট এডিটর হিসেবে কাজ করতে চাই..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs cursor-pointer"
                >
                  আবেদন পাঠান
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
