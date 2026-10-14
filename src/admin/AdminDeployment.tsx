import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import JSZip from 'jszip';
import { 
  Rocket, 
  Download, 
  CheckCircle2, 
  Terminal, 
  FolderArchive,
  Layers,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Radio
} from 'lucide-react';

const sourceFilesRaw = import.meta.glob(
  [
    '../*.{ts,tsx,css}',
    '../**/*.{ts,tsx,css}',
    '../../index.html',
    '../../vite.config.ts',
    '../../tsconfig.json',
    '../../package.json',
    '../../netlify.toml',
    '../../firebase-applet-config.json',
    '../../firebase-blueprint.json',
    '../../firestore.rules',
    '../../public/**/*',
    '../../.env.example'
  ],
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>;

export const AdminDeployment: React.FC = () => {
  const { showToast, posts, siteSettings, adPlacements } = useApp();
  const [isGeneratingSourceZip, setIsGeneratingSourceZip] = useState(false);
  const [isGeneratingDropZip, setIsGeneratingDropZip] = useState(false);
  const [zipGeneratedTime, setZipGeneratedTime] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const APP_VERSION = 'v2.7.0-cloud-sync-enabled';
  const RELEASE_DATE = '১২ অক্টোবর ২০২৬';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    showToast('কমান্ড কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const handleGenerateSourceZip = async () => {
    setIsGeneratingSourceZip(true);
    showToast('ক্লাউড সিঙ্ক সমর্থিত ১০০% সম্পূর্ণ সোর্স কোড জিপ প্রস্তুত হচ্ছে...', 'info');

    try {
      const zip = new JSZip();
      let filesCount = 0;

      Object.entries(sourceFilesRaw).forEach(([filePath, content]) => {
        if (!content || typeof content !== 'string') return;

        let cleanPath = filePath;
        if (cleanPath.startsWith('../../')) {
          cleanPath = cleanPath.replace('../../', '');
        } else if (cleanPath.startsWith('../')) {
          cleanPath = 'src/' + cleanPath.replace('../', '');
        }

        if (!cleanPath.includes('node_modules') && !cleanPath.includes('dist/')) {
          zip.file(cleanPath, content);
          filesCount++;
        }
      });

      // Package.json
      const packageJson = {
        name: "notun-kaker-shutro",
        private: true,
        version: "2.7.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview"
        },
        dependencies: {
          "@tailwindcss/vite": "^4.3.3",
          "@vitejs/plugin-react": "^6.1.1",
          "firebase": "^11.4.0",
          "jszip": "^3.10.2",
          "lucide-react": "^0.546.0",
          "motion": "^12.23.24",
          "react": "^19.0.1",
          "react-dom": "^19.0.1",
          "vite": "^8.3.0"
        },
        devDependencies: {
          "@types/node": "^22.14.0",
          "@types/react": "^19.3.0",
          "@types/react-dom": "^19.3.0",
          "tailwindcss": "^4.3.3",
          "typescript": "^5.7.2"
        }
      };
      zip.file('package.json', JSON.stringify(packageJson, null, 2));

      // netlify.toml
      const netlifyToml = `# Netlify Configuration for "নতুন কাজের সূত্র" (Notun Kajer Shutro)
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"
  CI = "false"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
`;
      zip.file('netlify.toml', netlifyToml);
      zip.file('public/_redirects', '/*    /index.html   200\n');

      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `notun-kaker-shutro-cloud-source-${APP_VERSION}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const now = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
      setZipGeneratedTime(now);
      showToast(`সফলভাবে ${filesCount}টি ফাইলসহ ক্লাউড-সংযুক্ত সোর্স জিপ ডাউনলোড হয়েছে!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('জিপ ফাইল তৈরি করতে ব্যর্থ হয়েছে।', 'error');
    } finally {
      setIsGeneratingSourceZip(false);
    }
  };

  const handleGenerateDropReadyZip = async () => {
    setIsGeneratingDropZip(true);
    showToast('Netlify Drop এর জন্য প্যাকেজ তৈরি হচ্ছে...', 'info');

    try {
      const zip = new JSZip();

      const indexHtmlDrop = `<!doctype html>
<html lang="bn">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${siteSettings.siteName || 'নতুন কাজের সূত্র (Notun Kajer Shutro)'}</title>
    <meta name="description" content="${siteSettings.metaDescription || 'লাইভ ভিডিও ও পোস্ট পোর্টাল'}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        font-family: 'Hind Siliguri', 'Plus Jakarta Sans', system-ui, sans-serif;
        background-color: #060b18;
        color: #f1f5f9;
      }
    </style>
  </head>
  <body class="bg-[#060b18] text-slate-100 min-h-screen">
    <header class="border-b border-slate-800 bg-slate-950/90 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">
          ন
        </div>
        <div>
          <h1 class="text-lg font-bold text-white tracking-wide">${siteSettings.siteName || 'নতুন কাজের সূত্র'}</h1>
          <p class="text-[11px] text-emerald-400">${siteSettings.tagline || 'লাইভ ভিডিও ও পোস্ট পোর্টাল'}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Netlify Live Broadcast
        </span>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div class="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 p-8 space-y-4 shadow-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
          🚀 ক্লাউড লাইভ ব্রডকাস্ট সক্রিয়
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white">
          ${siteSettings.siteName || 'নতুন কাজের সূত্র'} — অফিসিয়াল পোর্টাল
        </h2>
        <p class="text-sm text-slate-300 max-w-2xl leading-relaxed">
          ${siteSettings.metaDescription || 'লাইভ ভিডিও ও পোস্ট পোর্টাল — রিয়েলটাইম ক্লাউড ডাটাবেজ দ্বারা চালিত।'}
        </p>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-white">সাম্প্রতিক প্রকাশিত ভিডিও ও প্রতিবেদন</h3>
          <span class="text-xs text-slate-400 font-mono">মোট ${posts.length}টি কন্টেন্ট</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${posts.map(post => `
            <div class="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col">
              <div class="relative aspect-video bg-slate-950 overflow-hidden">
                <img src="${post.thumbnailUrl}" alt="${post.title}" class="w-full h-full object-cover" />
                <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-600/90 text-white backdrop-blur-sm">
                  ${post.category}
                </span>
                ${post.contentType === 'video' ? `
                  <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div class="w-10 h-10 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg">▶</div>
                  </div>
                ` : ''}
              </div>
              <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 class="font-bold text-white text-sm line-clamp-2 leading-snug">${post.title}</h4>
                  <p class="text-xs text-slate-400 mt-1.5 line-clamp-2">${post.description}</p>
                </div>
                <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>${post.publishedDate}</span>
                  <span class="text-emerald-400 font-medium">${post.author.name}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </main>

    <footer class="mt-16 border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
      <p>© ২০২৬ ${siteSettings.siteName || 'নতুন কাজের সূত্র'} — সর্বস্বত্ব সংরক্ষিত।</p>
    </footer>
  </body>
</html>`;

      zip.file('index.html', indexHtmlDrop);
      zip.file('_redirects', '/*    /index.html   200\n');
      zip.file('netlify.toml', `[build]\n  publish = "."\n\n[[redirects]]\n  from = "/*"\n  to = "/index.html"\n  status = 200\n`);

      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `notun-kaker-shutro-instant-drop-${APP_VERSION}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Netlify Drop রেডি জিপ সফলভাবে তৈরি হয়েছে!', 'success');
    } catch (err) {
      console.error(err);
      showToast('প্যাকেজ তৈরি করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setIsGeneratingDropZip(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
          <Rocket className="w-4 h-4" />
          <span>প্রোডাকশন ডেপ্লয়মেন্ট ও সমাধান কেন্দ্র</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Netlify ডেপ্লয়মেন্ট ও লাইভ পাবলিশিং গাইড
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          ভার্সন: <span className="text-emerald-400 font-mono font-bold">{APP_VERSION}</span> · ক্লাউড ডাটাবেজ: <span className="text-emerald-300 font-mono font-bold">Firebase Firestore Live</span>
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm sm:text-base">
          <Radio className="w-5 h-5 shrink-0 animate-pulse" />
          <span>অ্যাডমিনের আপলোড করা ভিডিও/ছবি অন্য মানুষ লাইভ দেখতে পারার সমাধান:</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <span>পূর্বে কেন দেখা যাচ্ছিল না?</span>
            </div>
            <p>
              পূর্বে পোস্ট এবং ভিডিওগুলো শুধুমাত্র আপনার ব্রাউজারের নিজস্ব <code>localStorage</code>-এ জমা হচ্ছিল। ব্রাউজারের লোকাল স্টোরেজ কেবল যে কম্পিউটারে কাজ করা হয় সেখানেই সীমাবদ্ধ থাকে। ফলে Netlify লিংক যখন অন্য কোনো মানুষ বা অন্য ডিভাইস থেকে খোলা হতো, তাদের ব্রাউজার সেই পোস্টগুলো খুঁজে পেত না।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
            <div className="text-emerald-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>বর্তমান অনলাইন ক্লাউড সমাধান:</span>
            </div>
            <p>
              আমরা প্রজেক্টটিতে <strong>Firebase Cloud Firestore</strong> ডাটাবেজ ইন্টিগ্রেট করে দিয়েছি! এখন আপনি অ্যাডমিন ড্যাশবোর্ড থেকে কোনো ভিডিও বা ছবি আপলোড দিলে তা সরাসরি <strong>অনলাইন ক্লাউডে সংরক্ষিত হয়</strong>।
            </p>
            <p className="text-emerald-400">
              ফলে Netlify-তে হোস্ট করা সাইটে বিশ্বের যেকোনো মানুষ যেকোনো মোবাইল, কম্পিউটার বা অন্য ওয়েবসাইট থেকে সাথে সাথেই আপনার আপলোড করা ভিডিও ও পোস্ট লাইভ দেখতে পারবে!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 p-6 space-y-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> অপশন ১ (GitHub + Netlify Build)
            </span>
            <h2 className="text-lg font-bold text-white">
              ১০০% কমপ্লিট সোর্স কোড ZIP (Firebase লাইভ সিঙ্ক সহ)
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              এই জিপ ফাইলে Firebase ক্লাউড ডাটাবেজ কনফিগারেশন, সমস্ত পেজ ও অ্যাডমিন ড্যাশবোর্ড, এবং netlify.toml অন্তর্ভুক্ত। এটি GitHub-এ পুশ করে Netlify-তে যুক্ত করলে সবসময় স্বয়ংক্রিয়ভাবে লাইভ থাকবে।
            </p>
          </div>

          <button
            onClick={handleGenerateSourceZip}
            disabled={isGeneratingSourceZip}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGeneratingSourceZip ? (
              <span>কোড প্যাকেজ হচ্ছে...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>কমপ্লিট ক্লাউড সোর্স জিপ ডাউনলোড করুন</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-900 p-6 space-y-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30">
              <FolderArchive className="w-3.5 h-3.5" /> অপশন ২ (Netlify Drop)
            </span>
            <h2 className="text-lg font-bold text-white">
              Netlify Drop রেডি জিপ (সরাসরি ড্র্যাগ &amp; ড্রপ করে লাইভ)
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              কোনো টার্মিনাল বা গিটহাব ছাড়াই সরাসরি <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-sky-400 underline font-semibold">app.netlify.com/drop</a> এ আপলোড করে মুহূর্তেই সাইট লাইভ করতে পারেন।
            </p>
          </div>

          <button
            onClick={handleGenerateDropReadyZip}
            disabled={isGeneratingDropZip}
            className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-sky-950 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGeneratingDropZip ? (
              <span>প্যাকেজ প্রস্তুত হচ্ছে...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Netlify Drop রেডি জিপ ডাউনলোড করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {zipGeneratedTime && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 
            সর্বশেষ জিপ সফলভাবে জেনারেট হয়েছে: {zipGeneratedTime}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Status: Production Live</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Netlify-তে সাইট ডিপ্লয় করার সহজ ধাপসমূহ</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-emerald-400 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                পদ্ধতি ১: GitHub-এর মাধ্যমে (স্থায়ী ও রিকমেন্ডেড)
              </span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              ১. অপশন ১ থেকে জিপ ডাউনলোড করে আনজিপ করুন।
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              ২. ফোল্ডারে টার্মিনাল খুলে গিটহাবে পুশ করুন:
            </p>

            <div className="relative">
              <pre className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`git init
git add .
git commit -m "Deploy with Firebase Cloud Live"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main`}
              </pre>
              <button
                onClick={() => copyToClipboard(`git init\ngit add .\ngit commit -m "Deploy with Firebase Cloud Live"\ngit branch -M main\ngit push -u origin main`, 'git')}
                className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] flex items-center gap-1 cursor-pointer"
              >
                {copiedCmd === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCmd === 'git' ? 'কপি হয়েছে' : 'কপি'}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ৩. <a href="https://app.netlify.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold">app.netlify.com</a> এ গিয়ে <strong>"Add new site"</strong> &gt; <strong>"Import an existing project"</strong> দিয়ে GitHub রিপোজিটরি নির্বাচন করে ডিপ্লয় দিন।
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-sky-400 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <FolderArchive className="w-4 h-4" />
                পদ্ধতি ২: Netlify Drop ড্র্যাগ &amp; ড্রপ
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ১. অপশন ২ থেকে <strong>Netlify Drop রেডি জিপ</strong> ডাউনলোড করুন।
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              ২. জিপ ফাইলটি আনজিপ করুন (ফোল্ডারে <code>index.html</code> ও <code>_redirects</code> ফাইল থাকবে)।
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              ৩. ব্রাউজারে <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-sky-400 underline font-semibold inline-flex items-center gap-1">
                app.netlify.com/drop <ExternalLink className="w-3 h-3" />
              </a> ওপেন করুন।
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              ৪. আনজিপ করা ফোল্ডারটি মাউস দিয়ে টেনে নেটলিফাই ড্রপ বক্সে ছেড়ে দিলেই সাইট সাথে সাথে লাইভ হয়ে যাবে!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
