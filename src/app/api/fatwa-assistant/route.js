// src/app/api/fatwa-assistant/route.js
import { retrieveWhitelistedFatwas } from "../../../lib/fatwa/retriever.js";
import { isWhitelistedUrl, getDomainInfo } from "../../../lib/fatwa/whitelist.js";

export const dynamic = "force-dynamic";

const FALLBACK_MESSAGE =
  "দুঃখিত, আমাদের অনুমোদিত ফতোয়া ওয়েবসাইটসমূহে আপনার প্রশ্নের সুনির্দিষ্ট উত্তরটি সরাসরি পাওয়া যায়নি। অনুগ্রহ করে সরাসরি বিজ্ঞ কোনো মুফতি সাহেবের সাথে যোগাযোগ করুন।";

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
 * Direct Zero-Hallucination Answer Extractor from Scraped Source Article.
 * Extracts the real question, answer text, core ruling, and citations directly from the authentic text.
 */
function extractDirectFatwaAnswer(article, query) {
  if (!article || (!article.content && !article.fullContent)) {
    return {
      found: false,
      summary: null,
      detailedExplanation: null,
      references: [],
      sourceTitle: null,
      sourceUrl: null,
      publisher: null,
      fallbackMessage: FALLBACK_MESSAGE,
    };
  }

  const rawText = article.content || article.fullContent;
  const paragraphs = rawText
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 20);

  // 1. Check if article has explicit Q&A structure ("প্রশ্ন" / "উত্তর" / "জবাব")
  let answerParagraphs = [];
  const ansIdx = paragraphs.findIndex((p) =>
    /^(?:উত্তর|জবাব|উত্তরঃ|জবাবঃ|আলজবাব)\b/i.test(p) || p.includes("উত্তর وعليكم") || p.includes("وعليكم السلام")
  );

  if (ansIdx !== -1) {
    answerParagraphs = paragraphs.slice(ansIdx);
  } else {
    answerParagraphs = paragraphs;
  }

  // 2. Identify core ruling summary sentence
  const allSentences = answerParagraphs
    .join(" ")
    .split(/[।!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 15);

  const rulingCues = [
    /জায়েয|জায়েয|ভাঙবে না|ভাঙ্গে না|নষ্ট হবে না|মাকরূহ|ওয়াজিব|ফরজ|সুন্নাত|হারাম|হালাল|অনুমোদিত|মুস্তাহাব|বিদআত নয়|বিদআত নয়|বৈধ|নাজায়েয|নাজায়েয/i,
  ];

  let summary = "";
  for (const sentence of allSentences) {
    if (rulingCues.some((r) => r.test(sentence))) {
      summary = sentence.length > 220 ? sentence.slice(0, 220) + "..." : sentence;
      if (!summary.endsWith("।") && !summary.endsWith("...")) summary += "।";
      break;
    }
  }

  if (!summary) {
    summary = allSentences[0]
      ? allSentences[0] + (allSentences[0].endsWith("।") ? "" : "।")
      : `${article.title} - অনুমোদিত ফতোয়া পোর্টাল থেকে সংগৃহীত।`;
  }

  // 3. Assemble detailed explanation text
  const cleanAnswerParagraphs = answerParagraphs.filter((p) => {
    // Filter out greeting alone or pure question alone if separate
    if (/^প্রশ্ন\s*:/i.test(p) && p.length < 100) return false;
    return true;
  });

  const detailedExplanation =
    cleanAnswerParagraphs.slice(0, 5).join("\n\n") || rawText.slice(0, 1000);

  // 4. Verbatim references
  const references = Array.isArray(article.references) ? article.references : [];

  return {
    found: true,
    summary,
    detailedExplanation,
    references,
    sourceTitle: article.title,
    sourceUrl: article.url,
    publisher: article.domainInfo?.name || "অনুমোদিত ইসলামিক পোর্টাল",
    fallbackMessage: null,
  };
}

/**
 * Optional Gemini Formatter (only runs if GEMINI_API_KEY is configured).
 * Formats the already-scraped text into query-adaptive presentation without hallucinating facts.
 */
async function callGeminiFormatter(apiKey, userQuery, sourceArticle) {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  const prompt = `তুমি "আস-সালাম আইডিয়াল মাদরাসা" এর "ফাতওয়া জিজ্ঞাসা" সহকারী।
নিচে একটি অনুমোদিত ফতোয়া ওয়েবসাইট থেকে হুবহু সংগৃহীত পাঠ দেওয়া হলো:

[উৎস শিরোনাম]: ${sourceArticle.title}
[উৎস পাঠ]:
${sourceArticle.content.slice(0, 3500)}

[ব্যবহারকারীর প্রশ্ন]: ${userQuery}

উৎস পাঠে থাকা তথ্যের ভিত্তিতে ভ্যালিড JSON প্রদান কর:
{
  "summary": "উৎস থেকে সরাসরি মূল ফতোয়া বা হুকুম",
  "detailedExplanation": "উৎস থেকে বিস্তারিত আলোচনা ও দলীলসমূহ",
  "references": ${JSON.stringify(sourceArticle.references || [])}
}`;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.0,
          responseMimeType: "application/json",
        },
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      if (parsed.summary && parsed.detailedExplanation) {
        return {
          found: true,
          summary: parsed.summary,
          detailedExplanation: parsed.detailedExplanation,
          references: Array.isArray(parsed.references) && parsed.references.length > 0
            ? parsed.references
            : sourceArticle.references || [],
          sourceTitle: sourceArticle.title,
          sourceUrl: sourceArticle.url,
          publisher: sourceArticle.domainInfo?.name || "অনুমোদিত ইসলামিক পোর্টাল",
          fallbackMessage: null,
        };
      }
    } catch (_) {}
  }
  return null;
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
          error: "অনুগ্রহ করে আপনার প্রশ্নটি পরিষ্কারভাবে লিখুন (কমপক্ষে ৩ অক্ষর)।",
        },
        { status: 400 }
      );
    }

    if (cleanQuery.length > 300) {
      return Response.json(
        {
          success: false,
          error: "প্রশ্নটি খুব দীর্ঘ। অনুগ্রহ করে ৩০০ অক্ষরের মধ্যে সংক্ষেপে লিখুন।",
        },
        { status: 400 }
      );
    }

    // 1. Fetch real matching fatwa articles strictly from whitelisted authoritative portals
    const retrievedArticles = await retrieveWhitelistedFatwas(cleanQuery, 3);

    // If no authentic articles found matching query
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
          fallbackMessage: FALLBACK_MESSAGE,
        },
      });
    }

    // 2. Select the most relevant article matching the query keywords in title or content
    let topArticle = retrievedArticles[0];
    const qTokens = cleanQuery.toLowerCase().split(/\s+/).filter((w) => w.length >= 3);
    if (retrievedArticles.length > 1 && qTokens.length > 0) {
      let maxMatches = -1;
      for (const art of retrievedArticles) {
        const text = (art.title + " " + (art.content || "")).toLowerCase();
        let matches = 0;
        for (const t of qTokens) {
          if (text.includes(t)) matches += 2;
        }
        if (art.title && qTokens.some(t => art.title.toLowerCase().includes(t))) {
          matches += 3;
        }
        if (matches > maxMatches) {
          maxMatches = matches;
          topArticle = art;
        }
      }
    }

    // 3. If Gemini API key is configured, attempt query-adaptive presentation
    let finalAnswer = null;
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      finalAnswer = await callGeminiFormatter(geminiKey, cleanQuery, topArticle);
    }

    // 3. Guaranteed Direct Authentic Extraction (Zero Hallucination)
    if (!finalAnswer) {
      finalAnswer = extractDirectFatwaAnswer(topArticle, cleanQuery);
    }

    // 4. Strict Whitelist Guard on Source URL
    if (finalAnswer.sourceUrl && !isWhitelistedUrl(finalAnswer.sourceUrl)) {
      finalAnswer.sourceUrl = topArticle.url;
      finalAnswer.sourceTitle = topArticle.title;
      finalAnswer.publisher = topArticle.domainInfo?.name;
    }

    return Response.json({
      success: true,
      data: {
        found: true,
        summary: finalAnswer.summary || "",
        detailedExplanation: finalAnswer.detailedExplanation || "",
        references: Array.isArray(finalAnswer.references) ? finalAnswer.references : [],
        sourceTitle: finalAnswer.sourceTitle || topArticle.title,
        sourceUrl: finalAnswer.sourceUrl || topArticle.url,
        publisher:
          finalAnswer.publisher ||
          topArticle.domainInfo?.name ||
          "অনুমোদিত ইসলামিক পোর্টাল",
        fallbackMessage: null,
      },
    });
  } catch (error) {
    console.error("Fatwa Assistant Route Error:", error);
    return Response.json(
      {
        success: false,
        error: "সার্ভারে প্রক্রিয়া করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
