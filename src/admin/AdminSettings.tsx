import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Save, 
  Bell, 
  Mail, 
  Globe, 
  RotateCcw 
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings, restoreDefaultData } = useApp();

  const [formData, setFormData] = useState({ ...siteSettings });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ওয়েবসাইট সেটিংস ও নোটিশ বোর্ড
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            পোর্টাল পরিচিতি, সোশ্যাল লিংক, ঘোষণা ব্যানার ও ক্লাউড কনফিগারেশন
          </p>
        </div>

        <button
          onClick={restoreDefaultData}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>ডিফল্ট বাংলা ডেটা পুনঃস্থাপন</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>সাধারণ পোর্টাল পরিচিতি</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">ওয়েবসাইটের নাম</label>
              <input
                type="text"
                value={formData.siteName}
                onChange={e => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">ট্যাগলাইন (Tagline)</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>হেডার ঘোষণা ব্যানার (Announcement Bar)</span>
            </h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementBar.enabled}
                onChange={e => setFormData({
                  ...formData,
                  announcementBar: { ...formData.announcementBar, enabled: e.target.checked }
                })}
                className="rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-slate-300">ঘোষণা ব্যানার সক্রিয়</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">ঘোষণার টেক্সট</label>
            <input
              type="text"
              value={formData.announcementBar.text}
              onChange={e => setFormData({
                ...formData,
                announcementBar: { ...formData.announcementBar, text: e.target.value }
              })}
              placeholder="জরুরি বিজ্ঞপ্তি বা আপডেটের টেক্সট লিখুন..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>অফিস ও যোগাযোগ বিবরণ</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">যোগাযোগ ইমেইল</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">হটলাইন ফোন নম্বর</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">অফিস ঠিকানা</label>
            <input
              type="text"
              value={formData.officeAddress}
              onChange={e => setFormData({ ...formData, officeAddress: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">সোশ্যাল মিডিয়া প্রোফাইল</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Facebook URL</label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={e => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Telegram URL</label>
              <input
                type="url"
                value={formData.telegramUrl}
                onChange={e => setFormData({ ...formData, telegramUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">YouTube URL</label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">আইনি ডিসক্লেইমার নোট</h3>
          <div>
            <textarea
              rows={3}
              value={formData.disclaimerText}
              onChange={e => setFormData({ ...formData, disclaimerText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>সকল পরিবর্তন ক্লাউডে সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
