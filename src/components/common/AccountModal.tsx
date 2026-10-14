import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Mail, 
  KeyRound, 
  Crown, 
  LogOut, 
  Sparkles, 
  AlertCircle,
  UserPlus,
  LogIn
} from 'lucide-react';

export const AccountModal: React.FC = () => {
  const { 
    accountModalOpen, 
    closeAccountModal, 
    currentPublicUser, 
    registerPublicUser, 
    loginPublicUser, 
    logoutPublicUser,
    requestPremium,
    navigateTo
  } = useApp();

  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!accountModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginPublicUser(email, password);
    if (res.success) {
      closeAccountModal();
      setEmail('');
      setPassword('');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('অনুগ্রহ করে জিমেইল ও পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    const userName = name.trim() || email.trim().split('@')[0];
    const res = registerPublicUser(userName, email, password);
    if (res.success) {
      closeAccountModal();
      setName('');
      setEmail('');
      setPassword('');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ব্যবহারকারী অ্যাকাউন্ট</h3>
              <p className="text-[11px] text-slate-400">নতুন কাজের সূত্র কন্টেন্ট ও প্রিমিয়াম মেম্বারশিপ</p>
            </div>
          </div>
          <button 
            onClick={closeAccountModal} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentPublicUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-white shrink-0">
                    {((currentPublicUser.name || currentPublicUser.email?.split('@')[0] || 'U').charAt(0) || 'U').toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {currentPublicUser.name || currentPublicUser.email?.split('@')[0] || 'ইউজার'}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">{currentPublicUser.email}</p>
                  </div>
                </div>

                {currentPublicUser.isPremium ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>প্রিমিয়াম সক্রিয়</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                    সাধারণ ইউজার
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                <span>যোগদানের তারিখ: {currentPublicUser.createdAt}</span>
                <span className="text-emerald-400 font-medium">স্ট্যাটাস: সক্রিয়</span>
              </div>
            </div>

            {currentPublicUser.isPremium ? (
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-slate-950 text-xs text-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Crown className="w-4 h-4 fill-current" />
                  <span>আপনার প্রিমিয়াম এক্সেস অনুমোদিত!</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  আপনি ওয়েবসাইটের সকল এক্সক্লুসিভ প্রিমিয়াম ভিডিও ও গোপন বাণিজ্যিক পোস্ট আনলক করতে পারবেন।
                </p>
                <button
                  onClick={() => { closeAccountModal(); navigateTo('premium'); }}
                  className="w-full mt-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>প্রিমিয়াম জোনে প্রবেশ করুন</span>
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>প্রিমিয়াম পারমিশন স্ট্যাটাস</span>
                  </span>
                  <span className="text-[10px] text-slate-400">অনুমতি প্রয়োজন</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  এক্সক্লুসিভ প্রিমিয়াম ভিডিও এবং পোস্ট দেখতে অ্যাডমিন কর্তৃক প্রিমিয়াম পারমিশন সক্রিয় করা আবশ্যক।
                </p>

                {currentPublicUser.premiumRequested ? (
                  <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] text-center font-medium">
                    ✓ প্রিমিয়াম পারমিশনের আবেদন অপেক্ষমাণ। অ্যাডমিনের অনুমোদনের পর সক্রিয় হবে।
                  </div>
                ) : (
                  <button
                    onClick={requestPremium}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>প্রিমিয়াম পারমিশনের জন্য আবেদন পাঠান</span>
                  </button>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => { closeAccountModal(); navigateTo('premium'); }}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                প্রিমিয়াম পাতা দেখুন →
              </button>
              <button
                onClick={() => { logoutPublicUser(); closeAccountModal(); }}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 text-red-300 hover:bg-red-900/50 text-xs font-medium flex items-center gap-1.5 transition-colors border border-red-500/20 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট করুন</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => { setTab('signin'); setErrorMsg(''); }}
                className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === 'signin' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>সাইন ইন (Sign In)</span>
              </button>
              <button
                onClick={() => { setTab('signup'); setErrorMsg(''); }}
                className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === 'signup' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>নতুন অ্যাকাউন্ট তৈরি</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {tab === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">জিমেইল / ইমেইল এড্রেস</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">পাসওয়ার্ড</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-md mt-2 cursor-pointer"
                >
                  সাইন ইন করুন
                </button>

                <p className="text-[11px] text-slate-500 text-center pt-1">
                  ডেমো ইউজার একাউন্ট: <span className="text-slate-400 font-mono">farhan@gmail.com</span> (পাসওয়ার্ড: <span className="text-slate-400 font-mono">user123</span>)
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">আপনার পূর্ণ নাম (ঐচ্ছিক)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="উদাঃ মোঃ তানভীর আহমেদ (খালি রাখলে জিমেইল ব্যবহৃত হবে)"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">জিমেইল / ইমেইল *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">পাসওয়ার্ড নির্ধারণ করুন *</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-md mt-2 cursor-pointer"
                >
                  অ্যাকাউন্ট তৈরি ও প্রবেশ করুন
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
