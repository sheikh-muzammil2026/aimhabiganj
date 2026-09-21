// src/lib/fatwa/extractor.js
import { isWhitelistedUrl, getDomainInfo } from "./whitelist.js";

/**
 * Decodes basic HTML entities
 */
function decodeHtmlEntities(str) {
  if (!str) return "";
  return str
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&zwnj;/g, "")
    .replace(/&zwj;/g, "")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
}

/**
 * Fetches page HTML with timeout and security headers.
 * Validates that redirects stay within whitelisted domains.
 */
export async function fetchArticleHtml(urlStr, timeoutMs = 15000) {
  if (!isWhitelistedUrl(urlStr)) {
    throw new Error(`Security Exception: URL '${urlStr}' is not in whitelisted domains.`);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(urlStr, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "bn-BD,bn;q=0.9,ar;q=0.8,en-US;q=0.7,en;q=0.6",
        "Cache-Control": "no-cache",
        Pragma: "no-cache"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch ${urlStr}`);
    }

    // Check final redirected URL
    if (response.url && !isWhitelistedUrl(response.url)) {
      throw new Error(`Security Exception: Redirected to non-whitelisted URL '${response.url}'`);
    }

    const html = await response.text();
    return { html, finalUrl: response.url || urlStr };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Extracts verbatim book/hadith/kitab references from text and HTML.
 */
export function extractVerbatimReferences(rawText, html = "") {
  const references = new Set();

  // 1. Look for explicit reference / footnote blocks in HTML
  // Common footnote/reference IDs or classes
  const footnoteBlockRegex = /<(?:div|section|aside|p)[^>]*(?:class|id)=["'][^"']*(?:reference|footnote|dalil|hawala|source|kitab)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section|aside|p)>/gi;
  let blockMatch;
  while ((blockMatch = footnoteBlockRegex.exec(html)) !== null) {
    const blockText = blockMatch[1]
      .replace(/<br\s*[\/]?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (blockText.length > 5 && blockText.length < 500) {
      references.add(decodeHtmlEntities(blockText));
    }
  }

  // 2. Scan text lines for verbatim citations
  const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);

  const referenceKeywords = [
    "কিতাব", "কিতাবু", "খণ্ড", "খন্ড", "পৃষ্ঠা", "পৃ.", "পৃ-", "হাদীস", "হাদিস",
    "ফাতাওয়া", "ফাতাওয়া", "রদ্দুল মুহতার", "বাদায়েউস সানায়ে", "আল-বাহরুর রায়েক",
    "ফাতাওয়া হিন্দিয়া", "আলমগীরী", "হেদায়া", "হিদায়া", "মুসান্নাফ", "বুখারী",
    "মুসলিম", "তিরমিযী", "আবু দাউদ", "নাসাঈ", "ইবনে মাজাহ", "المراجع", "الردود",
    "حوالہ", "দলিল", "দলীল", "রেফারেন্স", "তথ্যসূত্র", "সূত্র:"
  ];

  for (const line of lines) {
    const lineLower = line.toLowerCase();
    // Check if line contains citation cues
    const hasCue = referenceKeywords.some(kw => line.includes(kw));
    // Check for common citation patterns like (খণ্ড ১, পৃষ্ঠা ১৫০) or [১] বা কিতাব
    const hasVolumeOrPage = /(?:খণ্ড|খন্ড|পৃষ্ঠা|পৃ\.|পৃ-|হাদীস|হাদিস|নং|جلد|ص|حديث)\s*[:\-]?\s*[\d০-৯]+/i.test(line);

    if (hasCue && (hasVolumeOrPage || line.startsWith("-") || line.startsWith("•") || line.startsWith("১.") || line.startsWith("২.") || line.startsWith("১ ") || line.startsWith("২ "))) {
      // Keep only reasonably sized citations (avoid whole narrative paragraphs)
      if (line.length >= 10 && line.length <= 350) {
        references.add(line);
      }
    }
  }

  // 3. Scan for inline parenthetical citations e.g. (সহীহ বুখারী, হা. ১২৩৪; ফাতাওয়া শামী ২/১৪৫)
  const parenRegex = /\(([^)\n]*(?:সহীহ|সুনানে|জামে|কিতাব|ফাতাওয়া|ফাতাওয়া|বুখারী|মুসলিম|তিরমিযী|আবু দাউদ|হাদিস|হাদীস|হা\.|পৃষ্ঠা|খণ্ড|পৃ\.|رواه|أخرجه)[^)\n]*)\)/gi;
  let pMatch;
  while ((pMatch = parenRegex.exec(rawText)) !== null) {
    const citation = pMatch[1].trim();
    if (citation.length >= 8 && citation.length <= 250) {
      references.add(citation);
    }
  }

  return Array.from(references).slice(0, 8);
}

/**
 * Cleans raw HTML and extracts article title, main body text, and verbatim references.
 */
export function cleanAndExtractArticle(html, sourceUrl) {
  const domainInfo = getDomainInfo(sourceUrl);

  // Extract Page Title
  let title = "";
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (ogTitleMatch && ogTitleMatch[1]) {
    title = decodeHtmlEntities(ogTitleMatch[1].trim());
  } else {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = decodeHtmlEntities(titleMatch[1].trim());
    }
  }

  // Clean noise tags
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");

  // Extract block elements (p, h1-h6, li, blockquote)
  const blockMatches = cleaned.match(/<(?:p|h[1-6]|li|blockquote)[^>]*>([\s\S]*?)<\/(?:p|h[1-6]|li|blockquote)>/gi);
  let decodedText = "";

  if (blockMatches && blockMatches.length > 0) {
    const navTerms = ["রবিউল", "মুহাররম", "সফর", "যিলহজ্ব", "যিলকদ", "সকল সংখ্যা", "আরও বিভাগ", "সম্পাদকীয়", "লেখকবৃন্দ", "কপিরাইট", "সর্বস্বত্ব"];
    decodedText = blockMatches
      .map(b => decodeHtmlEntities(b.replace(/<br\s*[\/]?>/gi, " ").replace(/<[^>]+>/g, " ").trim()))
      .filter(t => t.length > 20 && !navTerms.some(term => t.startsWith(term) || (t.length < 50 && t.includes(term))))
      .join("\n\n");
  } else {
    // Fallback: strip tags
    const stripped = cleaned
      .replace(/<br\s*[\/]?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+/g, " ");
    decodedText = decodeHtmlEntities(stripped);
  }

  // Extract verbatim references
  const references = extractVerbatimReferences(decodedText, html);

  // Limit body text to ~6000 characters to fit context perfectly while preserving substance
  const trimmedBody = decodedText.slice(0, 6000);

  return {
    title: title || "ইসলামিক ফতোয়া ও গবেষণা",
    url: sourceUrl,
    domainInfo,
    content: trimmedBody,
    references
  };
}
