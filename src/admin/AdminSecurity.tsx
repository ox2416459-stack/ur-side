import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  UserPlus, 
  Ban, 
  LogOut, 
  Trash2, 
  Clock, 
  Check, 
  X, 
  UserCheck, 
  Crown, 
  User, 
  Eye, 
  EyeOff,
  Search,
  Sparkles,
  Radio
} from 'lucide-react';
import { AdminUser } from '../types';

export const AdminSecurity: React.FC = () => {
  const { 
    users, 
    addUser, 
    updateUser, 
    deleteUser, 
    toggleBlockUser, 
    forceLogoutUser,
    publicUsers,
    toggleBlockPublicUser,
    togglePremiumPublicUser,
    deletePublicUser,
    accessRequests,
    approveAccessRequest,
    rejectAccessRequest,
    auditLogs,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'public_users' | 'staff_users' | 'requests'>('public_users');
  const [publicUserSearch, setPublicUserSearch] = useState('');
  const [publicUserFilter, setPublicUserFilter] = useState<'all' | 'pending' | 'premium' | 'blocked'>('all');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminUser['role']>('Content Editor');

  const [passwordModalUser, setPasswordModalUser] = useState<AdminUser | null>(null);
  const [changedPassword, setChangedPassword] = useState('');

  const [approveRequestId, setApproveRequestId] = useState<string | null>(null);
  const [assignedPassword, setAssignedPassword] = useState('');
  const [assignedRole, setAssignedRole] = useState<AdminUser['role']>('Content Editor');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      showToast('সকল তথ্য পূরণ করুন।', 'error');
      return;
    }

    addUser({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole
    });

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser || !changedPassword.trim()) return;

    updateUser(passwordModalUser.id, { password: changedPassword.trim() });
    showToast(`"${passwordModalUser.name}" এর পাসওয়ার্ড আপডেট হয়েছে!`, 'success');
    setPasswordModalUser(null);
    setChangedPassword('');
  };

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approveRequestId || !assignedPassword.trim()) {
      showToast('একটি পাসওয়ার্ড দিন।', 'error');
      return;
    }

    approveAccessRequest(approveRequestId, assignedPassword.trim(), assignedRole);
    setApproveRequestId(null);
    setAssignedPassword('');
  };

  const pendingRequests = accessRequests.filter(r => r.status === 'pending');
  const premiumRequestedUsers = publicUsers.filter(u => u.premiumRequested && !u.isPremium);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>অ্যাকাউন্ট ও নিরাপত্তা নিয়ন্ত্রণ</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ব্যবহারকারী ও প্রিমিয়াম পারমিশন ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            পাবলিক অ্যাকাউন্ট অনুমোদন, প্রিমিয়াম অ্যাক্সেস সক্রিয়করণ, ব্লক ও ডিলিট কন্ট্রোল
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ নতুন অ্যাডমিন স্টাফ তৈরি</span>
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveTab('public_users')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'public_users'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Crown className="w-3.5 h-3.5 fill-current" />
          <span>পাবলিক অ্যাকাউন্ট ও প্রিমিয়াম ({publicUsers.length})</span>
          {premiumRequestedUsers.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
              {premiumRequestedUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('staff_users')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'staff_users'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>অ্যাডমিন স্টাফ ও এডিটর ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>অপেক্ষমাণ অ্যাক্সেস আবেদন ({pendingRequests.length})</span>
        </button>
      </div>

      {activeTab === 'public_users' && (
        <div className="space-y-6">
          {premiumRequestedUsers.length > 0 && (
            <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-amber-400 shrink-0 fill-current animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{premiumRequestedUsers.length} জন ব্যবহারকারী প্রিমিয়াম পারমিশনের জন্য আবেদন করেছেন!</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">New</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    তারা লাইভ সাইট থেকে আবেদন পাঠিয়েছেন। নিচে "অনুমোদন করুন" বোতামে ক্লিক করে সাথে সাথেই ক্লাউডে প্রিমিয়াম অ্যাক্সেস সক্রিয় করুন।
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setPublicUserFilter('pending')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold cursor-pointer border border-amber-500/30 transition-colors"
                >
                  আবেদনকারীদের ফিল্টার করুন
                </button>
                <button
                  onClick={() => {
                    premiumRequestedUsers.forEach(u => togglePremiumPublicUser(u.id));
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  <span>সবাইকে একসাথে অনুমোদন দিন</span>
                </button>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>ওয়েবসাইটে রেজিস্টার্ড ব্যবহারকারী তালিকা (Live Cloud Users)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  যেকোনো মানুষ বা ভিজিটর সাইটে এসে জিমেইল ও পাসওয়ার্ড দিয়ে অ্যাকাউন্ট বানালে সাথে সাথে এখানে লাইভ দেখতে পাবেন
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium font-mono">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>লাইভ সিঙ্ক ({publicUsers.length} জন)</span>
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="ইউজারের নাম বা জিমেইল খুঁজুন..."
                  value={publicUserSearch}
                  onChange={e => setPublicUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs flex-wrap">
                <button
                  onClick={() => setPublicUserFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    publicUserFilter === 'all' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  সকল ({publicUsers.length})
                </button>
                <button
                  onClick={() => setPublicUserFilter('pending')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    publicUserFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-amber-300 hover:text-white'
                  }`}
                >
                  <Crown className="w-3 h-3 fill-current" />
                  <span>আবেদনকারী ({premiumRequestedUsers.length})</span>
                </button>
                <button
                  onClick={() => setPublicUserFilter('premium')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    publicUserFilter === 'premium' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  প্রিমিয়াম মেম্বার ({publicUsers.filter(u => u.isPremium).length})
                </button>
                <button
                  onClick={() => setPublicUserFilter('blocked')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    publicUserFilter === 'blocked' ? 'bg-red-950 text-red-300 font-bold border border-red-500/40' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  ব্লকড ({publicUsers.filter(u => u.isBlocked).length})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">ব্যবহারকারী ও জিমেইল</th>
                    <th className="p-4">প্রিমিয়াম স্ট্যাটাস</th>
                    <th className="p-4">একাউন্ট অবস্থা</th>
                    <th className="p-4">যোগদানের তারিখ</th>
                    <th className="p-4 text-right">অ্যাডমিন অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {publicUsers
                    .filter(user => {
                      if (publicUserFilter === 'pending' && (!user.premiumRequested || user.isPremium)) return false;
                      if (publicUserFilter === 'premium' && !user.isPremium) return false;
                      if (publicUserFilter === 'blocked' && !user.isBlocked) return false;
                      if (publicUserSearch.trim()) {
                        const q = publicUserSearch.toLowerCase();
                        const nameStr = (user.name || '').toLowerCase();
                        const emailStr = (user.email || '').toLowerCase();
                        return nameStr.includes(q) || emailStr.includes(q);
                      }
                      return true;
                    })
                    .map(user => {
                      const displayName = user.name || (user.email ? user.email.split('@')[0] : 'ইউজার');
                      const initial = (displayName.charAt(0) || 'U').toUpperCase();
                      return (
                        <tr key={user.id} className="hover:bg-slate-855/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shrink-0">
                                {initial}
                              </div>
                              <div>
                                <div className="font-semibold text-white flex items-center gap-1.5">
                                  <span>{displayName}</span>
                                  {user.isPremium && <Crown className="w-3.5 h-3.5 text-amber-400 fill-current" />}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">{user.email || 'কোনো ইমেইল নেই'}</div>
                              </div>
                            </div>
                          </td>

                      <td className="p-4">
                        {user.isPremium ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                            <Crown className="w-3.5 h-3.5 fill-current" />
                            <span>প্রিমিয়াম অনুমোদিত (Active)</span>
                          </span>
                        ) : user.premiumRequested ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 text-[11px] font-bold animate-pulse">
                            <Crown className="w-3 h-3 text-amber-400 fill-current" />
                            <span>আবেদন করেছে (Pending Approval)</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400">
                            সাধারণ মেম্বার
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          user.isBlocked
                            ? 'bg-red-950 text-red-300 border border-red-500/30'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {user.isBlocked ? 'ব্লকড (Blocked)' : 'সক্রিয় (Active)'}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-slate-400 text-[11px]">
                        {user.createdAt}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => togglePremiumPublicUser(user.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                              user.isPremium
                                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30'
                                : user.premiumRequested
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-400/50 animate-pulse font-extrabold'
                                : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700'
                            }`}
                            title={user.isPremium ? 'প্রিমিয়াম পারমিশন বাতিল করুন' : 'প্রিমিয়াম পারমিশন সক্রিয় করুন'}
                          >
                            <Crown className="w-3.5 h-3.5 fill-current" />
                            <span>
                              {user.isPremium 
                                ? 'প্রিমিয়াম বাতিল' 
                                : user.premiumRequested 
                                ? '✓ অনুমোদন করুন' 
                                : 'প্রিমিয়াম পারমিশন দিন'}
                            </span>
                          </button>

                          <button
                            onClick={() => toggleBlockPublicUser(user.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                              user.isBlocked
                                ? 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30'
                                : 'bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-500/30'
                            }`}
                            title={user.isBlocked ? 'আনব্লক করুন' : 'ব্লক করুন'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>{user.isBlocked ? 'আনব্লক' : 'ব্লক'}</span>
                          </button>

                          <button
                            onClick={() => deletePublicUser(user.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="অ্যাকাউন্ট মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'staff_users' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>অনুমোদিত অ্যাডমিন স্টাফ ও পাসওয়ার্ড তালিকা</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">মোট {users.length} জন</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">স্টাফ নাম</th>
                  <th className="p-4">দায়িত্ব (Role)</th>
                  <th className="p-4">পাসওয়ার্ড</th>
                  <th className="p-4">অবস্থা</th>
                  <th className="p-4 text-right">নিয়ন্ত্রণ অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map(u => {
                  const isBlocked = u.status === 'blocked';
                  const isSuper = u.role === 'Super Admin';

                  return (
                    <tr key={u.id} className="hover:bg-slate-855/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                          <div>
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-medium">
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-medium bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                            {visiblePasswords[u.id] ? (u.password || '••••••••') : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setVisiblePasswords(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                            className="text-slate-400 hover:text-slate-200 cursor-pointer p-0.5"
                            title={visiblePasswords[u.id] ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                          >
                            {visiblePasswords[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => { setPasswordModalUser(u); setChangedPassword(u.password || ''); }}
                            className="text-[10px] text-slate-400 hover:text-emerald-400 underline cursor-pointer ml-1"
                          >
                            বদলান
                          </button>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isBlocked ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {isBlocked ? 'ব্লকড' : 'সক্রিয়'}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isSuper && (
                            <button
                              onClick={() => toggleBlockUser(u.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-500/30 cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => forceLogoutUser(u.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                          {!isSuper && (
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <span>লগইন স্ক্রিন থেকে প্রেরিত অ্যাক্সেস আবেদনসমূহ</span>
          </h3>

          {pendingRequests.length === 0 ? (
            <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs">
              কোনো অপেক্ষমাণ আবেদন নেই।
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map(req => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{req.name} ({req.email})</div>
                    {req.phone && <div className="text-slate-400 text-[11px]">ফোন: {req.phone}</div>}
                    <div className="text-slate-300 italic text-[11px] bg-slate-900 p-2 rounded mt-1">
                      "{req.reason}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => { setApproveRequestId(req.id); setAssignedPassword('shutro' + Math.floor(1000 + Math.random() * 9000)); }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>অনুমোদন ও পাসওয়ার্ড দিন</span>
                    </button>
                    <button
                      onClick={() => rejectAccessRequest(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>অডিট ও নিরাপত্তা লগ</span>
          </h3>
          <span className="text-xs text-slate-400">মোট {auditLogs.length} টি</span>
        </div>

        <div className="divide-y divide-slate-800 text-xs">
          {auditLogs.slice(0, 5).map(log => (
            <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-white">{log.action}</span>
                <span className="text-slate-400 ml-2">— {log.details}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono shrink-0">
                {log.performedBy} · {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4 shadow-2xl text-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">নতুন স্টাফ অ্যাকাউন্ট ও পাসওয়ার্ড তৈরি</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="উদাঃ মোঃ তানভীর আহমেদ"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">ইমেইল ঠিকানা *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="tanvir@notunkakershutro.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">লগইন পাসওয়ার্ড *</label>
                <input
                  type="text"
                  required
                  value={newUserPassword}
                  onChange={e => setNewUserPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">দায়িত্ব (Role)</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value="Content Editor">কনটেন্ট এডিটর</option>
                  <option value="Video Manager">ভিডিও ম্যানেজার</option>
                  <option value="Super Admin">সহকারী সুপার অ্যাডমিন</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {passwordModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4 shadow-2xl text-slate-100 text-xs">
            <h3 className="text-base font-bold text-white">
              "{passwordModalUser.name}" এর পাসওয়ার্ড পরিবর্তন
            </h3>
            <form onSubmit={handleSavePassword} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">নতুন পাসওয়ার্ড</label>
                <input
                  type="text"
                  required
                  value={changedPassword}
                  onChange={e => setChangedPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-emerald-400 font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-xl cursor-pointer"
                >
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {approveRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-emerald-500/30 bg-slate-900 p-6 space-y-4 shadow-2xl text-slate-100 text-xs">
            <h3 className="text-base font-bold text-white">আবেদন অনুমোদন ও লগইন ক্রেডেনশিয়াল প্রদান</h3>
            <form onSubmit={handleApprove} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">বরাদ্দকৃত লগইন পাসওয়ার্ড *</label>
                <input
                  type="text"
                  required
                  value={assignedPassword}
                  onChange={e => setAssignedPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">ভূমিকা (Role)</label>
                <select
                  value={assignedRole}
                  onChange={e => setAssignedRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value="Content Editor">কনটেন্ট এডিটর</option>
                  <option value="Video Manager">ভিডিও ম্যানেজার</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApproveRequestId(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white font-semibold rounded-xl cursor-pointer"
                >
                  অনুমোদন সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
