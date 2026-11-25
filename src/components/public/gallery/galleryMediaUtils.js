/**
 * Pure client-side helpers for parsing gallery video URLs
 * (YouTube, Vimeo, Facebook, and direct HTML5 video files).
 */

export function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) return match[1];
  }
  return null;
}

export function extractVimeoId(url) {
  if (!url || typeof url !== "string") return null;
  const match = url
    .trim()
    .match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i);
  return match ? match[1] : null;
}

export function isDirectVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  const clean = url.trim().split("?")[0].split("#")[0].toLowerCase();
  if (/\.(mp4|webm|ogg|ogv|mov|m4v)$/.test(clean)) {
    return true;
  }
  return /\/video\/upload\//i.test(url);
}

export function isFacebookVideoUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /(?:facebook\.com|fb\.watch|fb\.com)/i.test(url.trim());
}

export function getVideoPlaybackInfo(url, platform = "") {
  const originalUrl = typeof url === "string" ? url.trim() : "";
  if (!originalUrl) {
    return {
      kind: "external",
      embedUrl: "",
      thumbnailUrl: "",
      originalUrl: "",
      platformLabel: platform || "Video",
    };
  }

  const ytId = extractYouTubeId(originalUrl);
  if (ytId) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      originalUrl,
      platformLabel: platform || "YouTube",
    };
  }

  const vimeoId = extractVimeoId(originalUrl);
  if (vimeoId) {
    return {
      kind: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      thumbnailUrl: "",
      originalUrl,
      platformLabel: platform || "Vimeo",
    };
  }

  if (isDirectVideoUrl(originalUrl)) {
    return {
      kind: "direct",
      embedUrl: originalUrl,
      thumbnailUrl: "",
      originalUrl,
      platformLabel: platform || "Direct Video",
    };
  }

  if (isFacebookVideoUrl(originalUrl)) {
    return {
      kind: "facebook",
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        originalUrl,
      )}&show_text=false&autoplay=true`,
      thumbnailUrl: "",
      originalUrl,
      platformLabel: platform || "Facebook",
    };
  }

  return {
    kind: "external",
    embedUrl: originalUrl,
    thumbnailUrl: "",
    originalUrl,
    platformLabel: platform || "Video",
  };
}
