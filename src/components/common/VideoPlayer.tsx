import React from 'react';

interface VideoPlayerProps {
  url?: string;
  thumbnailUrl: string;
  title: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, thumbnailUrl, title, className = '' }) => {
  if (!url || !url.trim()) {
    return (
      <div className={`relative overflow-hidden bg-slate-950 rounded-2xl ${className}`}>
        <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
      </div>
    );
  }

  const cleanUrl = url.trim();

  // YouTube match (supports youtu.be, youtube.com/watch, youtube.com/embed, shorts)
  let youtubeId: string | null = null;
  const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    youtubeId = ytMatch[1];
  }

  if (youtubeId) {
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // Vimeo match
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return (
      <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 ${className}`}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // Direct video URL (MP4, WebM, Cloudinary, ImgBB, Supabase, Cloud storage video)
  return (
    <div className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 flex items-center justify-center ${className}`}>
      <video
        src={cleanUrl}
        controls
        playsInline
        preload="metadata"
        poster={thumbnailUrl && !thumbnailUrl.startsWith('data:video') ? thumbnailUrl : undefined}
        className="w-full h-full object-contain max-h-[85vh] bg-black"
      >
        <source src={cleanUrl} type="video/mp4" />
        <source src={cleanUrl} type="video/webm" />
        <source src={cleanUrl} type="video/quicktime" />
        আপনার ব্রাউজার সরাসরি এই ফরম্যাটের ভিডিও প্লে করতে পারছে না।
      </video>
    </div>
  );
};
