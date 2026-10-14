import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Check 
} from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const { mediaItems, addMediaItem, deleteMediaItem, showToast } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      addMediaItem({
        name: file.name,
        url: reader.result as string,
        sizeKb: Math.round(file.size / 1024),
        mimeType: file.type || 'image/jpeg'
      });
      showToast(`গ্যালারি থেকে "${file.name}" সফলভাবে লাইব্রেরিতে আপলোড হয়েছে!`, 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('মিডিয়া ইউআরএল কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newName.trim()) {
      showToast('অনুগ্রহ করে নাম এবং ছবির লিঙ্ক দিন।', 'error');
      return;
    }

    addMediaItem({
      name: newName.trim(),
      url: newUrl.trim(),
      sizeKb: Math.floor(150 + Math.random() * 400),
      mimeType: 'image/jpeg'
    });

    setNewUrl('');
    setNewName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            মিডিয়া লাইব্রেরি (Media Library)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ভিডিও কভার থাম্বনেইল, ব্যানার অ্যাসেট ও ফটো গ্যালারি ব্যবস্থাপনা
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleDeviceFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>📁 গ্যালারি থেকে সরাসরি আপলোড</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>ইউআরএল দিয়ে যুক্ত করুন</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaItems.map(item => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all shadow-md"
          >
            <div className="relative h-40 bg-slate-950 overflow-hidden">
              <img
                src={item.url}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-slate-300 font-mono">
                {item.sizeKb} KB
              </div>
            </div>

            <div className="p-3.5 space-y-2">
              <div className="text-xs font-medium text-white truncate" title={item.name}>
                {item.name}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {item.uploadedAt} · {item.mimeType}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopyUrl(item.id, item.url)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>URL কপি</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteMediaItem(item.id)}
                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/50 transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4 shadow-2xl text-slate-100 text-xs">
            <h3 className="text-base font-bold text-white">নতুন মিডিয়া ফাইল যুক্ত করুন</h3>
            
            <form onSubmit={handleAddMedia} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">ফাইলের নাম</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="custom-video-cover.jpg"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">ইমেজ বা নথির লিঙ্ক (Direct URL)</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
    </div>
  );
};
