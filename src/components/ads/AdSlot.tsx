import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdType } from '../../types';
import { AlertCircle, Eye, ShieldCheck } from 'lucide-react';

interface AdSlotProps {
  type: AdType;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ type, className = '' }) => {
  const { adPlacements, currentRoute } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasRendered, setHasRendered] = useState(false);

  const placement = adPlacements.find(p => p.type === type);
  const isAdminPage = currentRoute.startsWith('admin');

  useEffect(() => {
    if (isAdminPage || !placement || !placement.enabled || !placement.scriptCode.trim()) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    try {
      const iframe = document.createElement('iframe');
      iframe.title = `Ad Placement ${placement.name}`;
      iframe.className = 'w-full border-0 overflow-hidden';
      iframe.scrolling = 'no';
      iframe.setAttribute('loading', 'lazy');
      
      if (type === 'banner_header' || type === 'banner_footer') {
        iframe.style.height = '95px';
        iframe.style.maxHeight = '95px';
      } else if (type === 'banner_sidebar') {
        iframe.style.height = '260px';
        iframe.style.maxHeight = '260px';
      } else if (type === 'banner_content') {
        iframe.style.height = '80px';
        iframe.style.maxHeight = '80px';
      } else if (type === 'social_bar') {
        iframe.style.height = '70px';
      }

      container.appendChild(iframe);

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <base target="_blank">
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: transparent;
                  overflow: hidden;
                  font-family: system-ui, sans-serif;
                }
                .ad-wrapper {
                  width: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              </style>
            </head>
            <body>
              <div class="ad-wrapper">
                ${placement.scriptCode}
              </div>
            </body>
          </html>
        `);
        doc.close();
      }

      setHasRendered(true);
    } catch (e) {
      console.warn('Adsterra placement container notice:', e);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [placement?.enabled, placement?.scriptCode, type, isAdminPage]);

  if (!placement) return null;

  if (!placement.enabled) {
    return (
      <div className={`rounded-xl border border-dashed border-slate-800/80 bg-slate-900/30 p-3 text-center text-xs text-slate-500 ${className}`}>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>স্পন্সর বিজ্ঞাপন স্থান — বর্তমানে নিষ্ক্রিয় ({placement.sizeLabel})</span>
        </div>
      </div>
    );
  }

  if (!placement.scriptCode.trim()) {
    return (
      <div className={`rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-center text-xs text-amber-400 ${className}`}>
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>{placement.name}: বিজ্ঞাপন স্লট সক্রিয় কিন্তু স্ক্রিপ্ট কোড যুক্ত করা হয়নি। অ্যাডমিন প্যানেল থেকে কনফিগার করুন।</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-center transition-all ${className}`}>
      <div className="flex items-center justify-between px-2 pb-1 text-[10px] text-slate-400 uppercase tracking-wider">
        <span className="flex items-center gap-1 font-medium">
          <Eye className="w-2.5 h-2.5" /> বিজ্ঞাপন ({placement.sizeLabel})
        </span>
        <span className="text-slate-400">Adsterra Verified</span>
      </div>

      <div ref={containerRef} className="w-full flex justify-center items-center min-h-[50px]">
      </div>
    </div>
  );
};
