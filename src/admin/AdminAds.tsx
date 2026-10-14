import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Megaphone, 
  AlertCircle, 
  Eye, 
  Code, 
  Save, 
  Info 
} from 'lucide-react';

export const AdminAds: React.FC = () => {
  const { adPlacements, updateAdPlacement, showToast } = useApp();
  const [selectedPlacementId, setSelectedPlacementId] = useState<string>(adPlacements[0]?.id || 'ad-header');
  
  const currentPlacement = adPlacements.find(p => p.id === selectedPlacementId) || adPlacements[0];

  const [scriptCode, setScriptCode] = useState(currentPlacement?.scriptCode || '');
  const [enabled, setEnabled] = useState(currentPlacement?.enabled || false);
  const [deviceTarget, setDeviceTarget] = useState<'all' | 'desktop' | 'mobile'>(currentPlacement?.deviceTarget || 'all');
  const [placementId, setPlacementId] = useState(currentPlacement?.placementId || '');

  const handleSelectPlacement = (id: string) => {
    setSelectedPlacementId(id);
    const p = adPlacements.find(item => item.id === id);
    if (p) {
      setScriptCode(p.scriptCode);
      setEnabled(p.enabled);
      setDeviceTarget(p.deviceTarget);
      setPlacementId(p.placementId || '');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlacement) return;

    updateAdPlacement(currentPlacement.id, {
      enabled,
      scriptCode,
      deviceTarget,
      placementId
    });

    showToast(`"${currentPlacement.name}" বিজ্ঞাপন সেটিংস সফলভাবে সংরক্ষিত হয়েছে!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-sky-400 font-medium mb-1">
          <Megaphone className="w-4 h-4" />
          <span>মনিটাইজেশন কনফিগারেশন হাব</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Adsterra বিজ্ঞাপন স্লট নিয়ন্ত্রণ (Ad Management)
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          হেডার, সাইডবার, ইন-কনটেন্ট ব্যানার, সোশ্যাল বার ও পপআন্ডার স্ক্রিপ্ট কনফিগার করুন
        </p>
      </div>

      <div className="rounded-2xl border border-sky-500/20 bg-sky-950/20 p-4 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-sky-400 font-semibold">
          <Info className="w-4 h-4" />
          <span>অফিসিয়াল Adsterra কোড ইন্টিগ্রেশন নির্দেশিকা</span>
        </div>
        <p className="leading-relaxed">
          আপনার Adsterra পাবলিশার ড্যাশবোর্ড থেকে অনুমোদিত স্ক্রিপ্ট কোডটি সরাসরি এখানে কপি করে পেস্ট করুন। বিজ্ঞাপন কোড আইসোলেটেড সুরক্ষিত কন্টেইনারে লোড হয় যা মূল ওয়েবসাইটের স্পিড ও সিকিউরিটিকে সুরক্ষিত রাখে।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            বিজ্ঞাপন স্লট নির্বাচন করুন
          </h3>
          <div className="space-y-2">
            {adPlacements.map(placement => {
              const isSelected = placement.id === selectedPlacementId;
              const hasMissingCode = placement.enabled && !placement.scriptCode.trim();

              return (
                <div
                  key={placement.id}
                  onClick={() => handleSelectPlacement(placement.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-sky-500 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{placement.name}</span>
                    <span className={`w-2 h-2 rounded-full ${placement.enabled ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{placement.sizeLabel}</span>
                    <span className="font-mono text-[10px] text-slate-500">{placement.placementId}</span>
                  </div>

                  {hasMissingCode && (
                    <div className="mt-2 text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      <span>কোড নেই (সতর্কতা)</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">{currentPlacement.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentPlacement.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">অবস্থা:</span>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  enabled ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {enabled && !scriptCode.trim() && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                সতর্কতা: এই বিজ্ঞাপন স্লটটি সক্রিয় (Enabled) কিন্তু কোনো স্ক্রিপ্ট কোড যুক্ত করা নেই। ব্যবহারকারীরা সাইটে শূন্যস্থান দেখতে পাবেন।
              </span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Adsterra প্লেসমেন্ট আইডি / রেফারেন্স
                </label>
                <input
                  type="text"
                  value={placementId}
                  onChange={e => setPlacementId(e.target.value)}
                  placeholder="উদাঃ AD-AST-HDR-01"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  ডিভাইস দৃশ্যমানতা (Target Device)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'সকল ডিভাইস' },
                    { id: 'desktop', label: 'ডেস্কটপ' },
                    { id: 'mobile', label: 'মোবাইল' }
                  ].map(dev => (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => setDeviceTarget(dev.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-center transition-colors cursor-pointer ${
                        deviceTarget === dev.id
                          ? 'bg-sky-600 text-white font-semibold'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {dev.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-sky-400" />
                  <span>Adsterra স্ক্রিপ্ট স্নsnippet কোড</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">HTML / Javascript</span>
              </div>
              <textarea
                rows={7}
                value={scriptCode}
                onChange={e => setScriptCode(e.target.value)}
                placeholder="<!-- Paste your Adsterra ad code snippet here -->"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-[11px] leading-relaxed focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 mb-2 block flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>ড্যাশবোর্ড টেস্ট প্রিভিউ:</span>
              </span>
              <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-950 text-center">
                {enabled && scriptCode.trim() ? (
                  <div className="text-xs text-emerald-400 space-y-1">
                    <div className="font-semibold">কোড সংরক্ষিত ও সক্রিয় আছে</div>
                    <div className="text-[11px] text-slate-400">
                      স্লট: {currentPlacement.name} ({currentPlacement.sizeLabel})
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">
                    বিজ্ঞাপন স্লট বর্তমানে নিষ্ক্রিয় রয়েছে।
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>বিজ্ঞাপন কনফিগারেশন সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
