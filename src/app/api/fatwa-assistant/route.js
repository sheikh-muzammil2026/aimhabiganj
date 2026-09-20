// src/app/api/fatwa-assistant/route.js
import { retrieveWhitelistedFatwas } from "../../../lib/fatwa/retriever.js";
import { isWhitelistedUrl, getDomainInfo } from "../../../lib/fatwa/whitelist.js";

export const dynamic = "force-dynamic";

const FALLBACK_MESSAGE =
  "দুঃখিত, আমাদের অনুমোদিত ফতোয়া ওয়েবসাইটসমূহে আপনার প্রশ্নের সুনির্দিষ্ট উত্তরটি পাওয়া যায়নি। অনুগ্রহ করে সরাসরি বিজ্ঞ কোনো মুফতি সাহেবের সাথে যোগাযোগ করুন।";

/**
 * Basic input sanitizer
 */
function sanitizeQuery(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/[<>{}\\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Builds the strict LLM system prompt
 */
function buildSystemPrompt() {
  return `তুমি হলে "আস-সালাম আইডিয়াল মাদরাসা (এইম)" এর "ফাতওয়া জিজ্ঞাসা" (Fatwa Query) বিশেষজ্ঞ এআই সহকারী।
তোমার একমাত্র ও অপরিবর্তনীয় দায়িত্ব হলো: নিচে প্রদত্ত [VERIFIED_CONTEXT] থেকে শুধুমাত্র তথ্যের ভিত্তিতে ইউজারের প্রশ্নের উত্তর প্রদান করা।

[কঠোর সত্যনিষ্ঠতা ও বিধিনিষেধ (Zero Hallucination Rules)]:
১. তুমি নিজের মেমোরি বা সাধারণ জ্ঞান থেকে কোনো ইসলামী বিধান, ফতোয়া, কিতাবের নাম, খণ্ড, পৃষ্ঠা বা হাদিস নম্বর অনুমান বা যোগ করতে পারবে না।
২. তোমার প্রতিটি বক্তব্যের তথ্য সরাসরি নিচে প্রদত্ত [VERIFIED_CONTEXT]-এ বিদ্যমান থাকতে হবে।
৩. কিতাবের নাম, খণ্ড, পৃষ্ঠা ও দলীলসমূহ হুবহু (verbatim) Context থেকে কপি করে "references" লিস্টে রাখবে। যদি Context-এ কোনো কিতাবের রেফারেন্স না থাকে, তবে খালি অ্যারে [] দেবে; নিজে থেকে কোনো কাল্পনিক বা স্মৃতি থেকে কিতাবের নাম লিখবে না।
৪. ফলব্যাক নির্দেশ (Fallback Policy):
   যদি প্রদত্ত Context-এ ব্যবহারকারীর প্রশ্নের সুনির্দিষ্ট ও সুস্পষ্ট উত্তর না থাকে, তবে "found" ফিল্ড false করবে এবং "fallbackMessage" এ হুবহু এই লেখাটি দেবে:
   "${FALLBACK_MESSAGE}"

[আউটপুট ফরম্যাট - শুধুমাত্র ভ্যালিড JSON প্রদান করবে, কোনো অতিরিক্ত টেক্সট বা মার্কডাউন ব্যাকটিক ছাড়া]:
{
  "found": true,
  "summary": "সারসংক্ষেপ / মূল ফতোয়া (১-২ বাক্যে সরাসরি স্পষ্ট বিধান)",
  "detailedExplanation": "বিস্তারিত ব্যাখ্যা (প্রদত্ত উৎসের তথ্যানুযায়ী সহজ ও প্রাঞ্জল বাংলায়)",
  "references": [
    "উৎস থেকে হুবহু উদ্ধৃত কিতাব ও রেফারেন্স (যেমন: ফাতাওয়া হিন্দিয়া - খণ্ড ১, পৃষ্ঠা ১৮০)"
  ],
  "sourceTitle": "আর্টিকেলের শিরোনাম (Context থেকে)",
  "sourceUrl": "আর্টিকেলের মূল URL (Context-এ উল্লেখিত whitelisted URL)",
  "publisher": "ওয়েবসাইটের নাম (যেমন: মাসিক আলকাউসার)",
  "fallbackMessage": null
}`;
}

/**
 * Calls Gemini Flash with zero temperature and structured JSON response
 */
async function callGemini(apiKey, systemPrompt, userQuery, contextText) {
  const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError = null;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\n[VERIFIED_CONTEXT]:\n${contextText}\n\n[USER_QUESTION]:\n${userQuery}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.0,
          maxOutputTokens: 1500,
          responseMimeType: "application/json"
        }
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errBody = await res.text();
        lastError = new Error(`Gemini ${model} returned HTTP ${res.status}: ${errBody}`);
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      // Clean markdown fences if any
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Gemini API generation failed.");
}

/**
 * Calculates keyword relevance ratio between query and candidate article
 */
function calculateRelevanceRatio(query, article) {
  if (!article || !article.content) return 0;
  const stopWords = ["সম্পর্কে", "বিধান", "কী", "কি", "হুকুম", "বলুন", "জানতে", "চাই", "করার", "নিয়ে", "নিয়ম", "শরীয়তের", "হলে", "কিনা", "এর", "এবং", "ও", "বা", "থেকে", "দিয়ে", "করা", "জন্য", "আছে"];
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w));

  if (queryWords.length === 0) return 0;

  const targetText = `${article.title} ${article.content}`.toLowerCase();
  const matchedWords = queryWords.filter(w => targetText.includes(w));
  return matchedWords.length / queryWords.length;
}

/**
 * Deterministic Fallback Extractor:
 * If LLM API call fails or key is unconfigured, this directly formats the verified retrieved article
 * so that the user still receives verified Islamic rulings with zero hallucination.
 */
function buildDeterministicResponseFromArticle(article, query) {
  const relevance = calculateRelevanceRatio(query, article);
  // If relevance is below threshold, return official fallback to prevent off-topic false positives
  if (!article || !article.content || relevance < 0.3) {
    return {
      found: false,
      summary: null,
      detailedExplanation: null,
      references: [],
      sourceTitle: null,
      sourceUrl: null,
      publisher: null,
      fallbackMessage: FALLBACK_MESSAGE
    };
  }

  // Extract top meaningful excerpt
  const paragraphs = article.content.split("\n\n").filter(p => p.length > 40);
  const relevantParagraphs = paragraphs.slice(0, 3).join("\n\n");

  return {
    found: true,
    summary: `${article.title} - নির্ভরযোগ্য ফতোয়া পোর্টাল থেকে সংগৃহীত।`,
    detailedExplanation: relevantParagraphs || article.content.slice(0, 800) + "...",
    references: article.references && article.references.length > 0 ? article.references : [],
    sourceTitle: article.title,
    sourceUrl: article.url,
    publisher: article.domainInfo?.name || "অনুমোদিত ইসলামিক পোর্টাল",
    fallbackMessage: null
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const rawQuery = body?.query;
    const cleanQuery = sanitizeQuery(rawQuery);

    if (!cleanQuery || cleanQuery.length < 2) {
      return Response.json(
        {
          success: false,
          error: "অনুগ্রহ করে আপনার প্রশ্নটি পরিষ্কারভাবে লিখুন (কমপক্ষে ৩ অক্ষর)।"
        },
        { status: 400 }
      );
    }

    if (cleanQuery.length > 300) {
      return Response.json(
        {
          success: false,
          error: "প্রশ্নটি খুব দীর্ঘ। অনুগ্রহ করে ৩০০ অক্ষরের মধ্যে সংক্ষেপে লিখুন।"
        },
        { status: 400 }
      );
    }

    // 1. Retrieve top matching articles strictly from Whitelisted Domains
    const retrievedArticles = await retrieveWhitelistedFatwas(cleanQuery, 2);

    // If no whitelisted articles match, return immediate strict fallback
    if (!retrievedArticles || retrievedArticles.length === 0) {
      return Response.json({
        success: true,
        data: {
          found: false,
          summary: null,
          detailedExplanation: null,
          references: [],
          sourceTitle: null,
          sourceUrl: null,
          publisher: null,
          fallbackMessage: FALLBACK_MESSAGE
        }
      });
    }

    // 2. Prepare Verified Context for LLM
    const contextBlocks = retrievedArticles.map((art, idx) => {
      return `--- [উৎস ${idx + 1}] ---
শিরোনাম: ${art.title}
ইউআরএল: ${art.url}
ওয়েবসাইট: ${art.domainInfo?.name || "অনুমোদিত ফতোয়া পোর্টাল"}
মূল পাঠ:
${art.content.slice(0, 3000)}
সরাসরি উল্লেখিত কিতাব ও রেফারেন্সসমূহ:
${art.references.length > 0 ? art.references.map(r => `• ${r}`).join("\n") : "কোনো রেফারেন্স উল্লেখ নেই"}`;
    });

    const contextText = contextBlocks.join("\n\n");
    const systemPrompt = buildSystemPrompt();

    // 3. Invoke LLM if GEMINI_API_KEY is configured
    const apiKey = process.env.GEMINI_API_KEY;
    let finalResult = null;

    if (apiKey && !apiKey.startsWith("AQ.Ab")) {
      try {
        finalResult = await callGemini(apiKey, systemPrompt, cleanQuery, contextText);
      } catch (geminiErr) {
        console.warn("Gemini call failed, falling back to deterministic extraction:", geminiErr.message);
      }
    }

    // 4. If LLM was not run or failed, use deterministic grounding directly from top verified article
    if (!finalResult) {
      finalResult = buildDeterministicResponseFromArticle(retrievedArticles[0], cleanQuery);
    }

    // 5. Final Whitelist Verification Guard
    // If the answer links to an unverified domain, override or enforce fallback
    if (finalResult.found && finalResult.sourceUrl) {
      if (!isWhitelistedUrl(finalResult.sourceUrl)) {
        // Fallback to the retrieved article's guaranteed valid URL
        finalResult.sourceUrl = retrievedArticles[0].url;
        finalResult.sourceTitle = retrievedArticles[0].title;
        finalResult.publisher = retrievedArticles[0].domainInfo?.name;
      }
    }

    // If found is false or fallbackMessage is present
    if (!finalResult.found) {
      return Response.json({
        success: true,
        data: {
          found: false,
          summary: null,
          detailedExplanation: null,
          references: [],
          sourceTitle: null,
          sourceUrl: null,
          publisher: null,
          fallbackMessage: FALLBACK_MESSAGE
        }
      });
    }

    return Response.json({
      success: true,
      data: {
        found: true,
        summary: finalResult.summary || "",
        detailedExplanation: finalResult.detailedExplanation || "",
        references: Array.isArray(finalResult.references) ? finalResult.references : [],
        sourceTitle: finalResult.sourceTitle || retrievedArticles[0].title,
        sourceUrl: finalResult.sourceUrl || retrievedArticles[0].url,
        publisher: finalResult.publisher || retrievedArticles[0].domainInfo?.name || "অনুমোদিত ফতোয়া পোর্টাল",
        fallbackMessage: null
      }
    });
  } catch (error) {
    console.error("Fatwa Assistant Route Error:", error);
    return Response.json(
      {
        success: false,
        error: "সার্ভারে প্রক্রিয়া করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।"
      },
      { status: 500 }
    );
  }
}
