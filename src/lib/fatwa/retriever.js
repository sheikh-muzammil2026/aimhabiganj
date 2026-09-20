// src/lib/fatwa/retriever.js
import { WHITELISTED_DOMAINS, isWhitelistedUrl, getDomainInfo, getSiteQueryFilter } from "./whitelist.js";
import { fetchArticleHtml, cleanAndExtractArticle } from "./extractor.js";

/**
 * Unwraps DuckDuckGo redirect URLs (//duckduckgo.com/l/?uddg=https%3A...)
 */
function unwrapTargetUrl(rawHref) {
  if (!rawHref) return null;
  try {
    let cleanHref = rawHref.trim();
    if (cleanHref.startsWith("//")) {
      cleanHref = "https:" + cleanHref;
    }
    if (cleanHref.includes("duckduckgo.com/l/?") || cleanHref.includes("uddg=")) {
      const urlObj = new URL(cleanHref);
      const uddg = urlObj.searchParams.get("uddg");
      if (uddg) {
        return decodeURIComponent(uddg);
      }
    }
    return cleanHref;
  } catch {
    return null;
  }
}

/**
 * Searches via Google Programmable Search JSON API (if configured in env)
 */
async function searchGoogleCSE(query) {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY || process.env.GOOGLE_CSE_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX || process.env.GOOGLE_CSE_CX;
  if (!apiKey || !cx) return null;

  try {
    const siteFilter = getSiteQueryFilter();
    const endpoint = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(
      `${query} ${siteFilter}`
    )}&num=5`;

    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.items || !Array.isArray(data.items)) return [];

    return data.items
      .map(item => item.link)
      .filter(link => isWhitelistedUrl(link));
  } catch (err) {
    console.warn("Google CSE error:", err);
    return null;
  }
}

/**
 * Searches via Tavily API (if configured in env)
 */
async function searchTavily(query) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;

  try {
    const allowedDomains = WHITELISTED_DOMAINS.map(d => d.domain);
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: "advanced",
        include_domains: allowedDomains,
        max_results: 5
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results
      .map(r => r.url)
      .filter(link => isWhitelistedUrl(link));
  } catch (err) {
    console.warn("Tavily error:", err);
    return null;
  }
}

/**
 * Direct search on whitelisted portals (Alkawsar, Ahlehaq Media, etc.)
 * Queries whitelisted sources concurrently for maximum coverage and speed.
 */
async function searchWhitelistedSitesDirectly(query) {
  const discovered = new Set();
  const searchTerms = [query];

  // If query is conversational, extract core Islamic keywords
  const stopWords = ["সম্পর্কে", "বিধান", "কী", "কি", "হুকুম", "বলুন", "জানতে", "চাই", "করার", "নিয়ে", "নিয়ম", "শরীয়তের", "হলে", "কিনা"];
  const words = query.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
  if (words.length > 0 && words.length < query.split(/\s+/).length) {
    searchTerms.push(words.slice(0, 3).join(" "));
  }
  // Also add key individual religious terms if multiple words exist
  if (words.length > 1) {
    for (const w of words) {
      if (w.length >= 3 && !searchTerms.includes(w)) {
        searchTerms.push(w);
      }
    }
  }

  // 1. Search Alkawsar
  const searchAlkawsar = async () => {
    for (const term of searchTerms.slice(0, 3)) {
      try {
        const res = await fetch(`https://www.alkawsar.com/bn/search/?q=${encodeURIComponent(term)}`, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "bn,en;q=0.9"
          }
        });
        if (res.ok) {
          const text = await res.text();
          const matches = text.match(/\/bn\/article\/\d+\//g);
          if (matches) {
            for (const m of matches) {
              const fullUrl = `https://www.alkawsar.com${m}`;
              if (isWhitelistedUrl(fullUrl)) {
                discovered.add(fullUrl);
              }
            }
          }
        }
      } catch (e) {
        console.warn("Alkawsar search error:", e.message);
      }
      if (discovered.size >= 4) break;
    }
  };

  // 2. Search Ahlehaq Media
  const searchAhlehaq = async () => {
    for (const term of searchTerms.slice(0, 2)) {
      try {
        const res = await fetch(`https://ahlehaqmedia.com/?s=${encodeURIComponent(term)}`, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
          }
        });
        if (res.ok) {
          const text = await res.text();
          const postMatches = text.match(/href=["'](https:\/\/ahlehaqmedia\.com\/(?:archives\/|\d+|[\w\-%]+)\/?)["']/gi);
          if (postMatches) {
            for (const raw of postMatches) {
              const url = raw.replace(/^href=["']|["']$/gi, "");
              if (
                isWhitelistedUrl(url) &&
                !url.includes("/wp-") &&
                !url.includes("/feed") &&
                !url.includes("/category/") &&
                !url.includes("/tag/") &&
                !url.includes("/author/") &&
                url !== "https://ahlehaqmedia.com/"
              ) {
                discovered.add(url);
              }
            }
          }
        }
      } catch (e) {
        console.warn("Ahlehaq search error:", e.message);
      }
      if (discovered.size >= 6) break;
    }
  };

  await Promise.allSettled([searchAlkawsar(), searchAhlehaq()]);
  return Array.from(discovered);
}

/**
 * Free Zero-Config Fallback Search strictly restricted to whitelisted sites
 */
async function searchDirectWeb(query) {
  // First try direct portal search
  const directPortalUrls = await searchWhitelistedSitesDirectly(query);
  if (directPortalUrls && directPortalUrls.length > 0) {
    return directPortalUrls;
  }

  const siteFilter = getSiteQueryFilter();
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(`${siteFilter} ${query}`)}`;

  try {
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "bn,en;q=0.9"
      }
    });

    if (!res.ok) return [];
    const html = await res.text();

    const linkRegex = /<a[^>]+class=["'][^"']*(?:result__url|result__snippet|result__title)[^"']*["'][^>]+href=["']([^"']+)["']/gi;
    const discovered = new Set();
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const unwrapped = unwrapTargetUrl(match[1]);
      if (unwrapped && isWhitelistedUrl(unwrapped)) {
        // Strip tracking params
        try {
          const u = new URL(unwrapped);
          u.search = "";
          u.hash = "";
          discovered.add(u.toString());
        } catch {
          discovered.add(unwrapped);
        }
      }
    }

    return Array.from(discovered);
  } catch (err) {
    console.error("Direct web search error:", err);
    return [];
  }
}

/**
 * Main Strict Retriever:
 * 1. Executes multi-tier search
 * 2. Filters strictly through Domain Whitelist Guard
 * 3. Fetches and extracts clean text & verbatim references
 * 
 * @param {string} query User query
 * @param {number} maxResults Max articles to fetch (default: 3)
 * @returns {Promise<Array>} List of extracted article objects
 */
export async function retrieveWhitelistedFatwas(query, maxResults = 3) {
  if (!query || typeof query !== "string" || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim();
  let candidateUrls = [];

  // Tier 1: Google Custom Search
  const googleUrls = await searchGoogleCSE(cleanQuery);
  if (googleUrls && googleUrls.length > 0) {
    candidateUrls = googleUrls;
  }

  // Tier 2: Tavily (if Google CSE didn't yield results)
  if (candidateUrls.length === 0) {
    const tavilyUrls = await searchTavily(cleanQuery);
    if (tavilyUrls && tavilyUrls.length > 0) {
      candidateUrls = tavilyUrls;
    }
  }

  // Tier 3: Direct Web Search Fallback
  if (candidateUrls.length === 0) {
    const directUrls = await searchDirectWeb(cleanQuery);
    if (directUrls && directUrls.length > 0) {
      candidateUrls = directUrls;
    }
  }

  // Score and sort URLs to prioritize deep fatwa/article pages over root homepages
  const scoreUrl = url => {
    try {
      const parsed = new URL(url);
      const path = parsed.pathname.toLowerCase();
      if (path === "/" || path === "/bn" || path === "/en" || path === "/bn/" || path === "/en/") {
        return 0;
      }
      if (
        path.includes("/article/") ||
        path.includes("/fatwa") ||
        path.includes("/question/") ||
        path.includes("/masala") ||
        path.includes("/archives/") ||
        /\/\d+\/?$/.test(path)
      ) {
        return 10;
      }
      return 5;
    } catch {
      return 1;
    }
  };

  // Double-check Whitelist Guard (Zero Tolerance for non-whitelisted domains)
  const validUrls = Array.from(new Set(candidateUrls))
    .filter(url => isWhitelistedUrl(url))
    .sort((a, b) => scoreUrl(b) - scoreUrl(a))
    .slice(0, maxResults);

  if (validUrls.length === 0) {
    return [];
  }

  // Fetch and parse top whitelisted articles concurrently
  const fetchPromises = validUrls.map(async url => {
    try {
      const { html, finalUrl } = await fetchArticleHtml(url);
      const article = cleanAndExtractArticle(html, finalUrl);
      // Ensure there is substantial content
      if (article.content && article.content.length > 150) {
        return article;
      }
      return null;
    } catch (err) {
      console.warn(`Failed to process article from ${url}:`, err.message);
      return null;
    }
  });

  const settled = await Promise.allSettled(fetchPromises);
  const articles = settled
    .filter(s => s.status === "fulfilled" && s.value !== null)
    .map(s => s.value);

  return articles;
}
