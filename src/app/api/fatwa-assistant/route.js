// src/app/api/fatwa-assistant/route.js
import { retrieveWhitelistedFatwas } from "../../../lib/fatwa/retriever.js";
import {
  isWhitelistedUrl,
  getDomainInfo,
} from "../../../lib/fatwa/whitelist.js";

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
 * Builds the strict LLM system prompt with Query-Adaptive Synthesis instructions
 */
function buildSystemPrompt() {
  return `তুমি হলে "আস-সালাম আইডিয়াল মাদরাসা" এর "ফাতওয়া জিজ্ঞাসা" বিশেষজ্ঞ এআই সহকারী।
তোমার দায়িত্ব হলো নিচে দেওয়া [VERIFIED_CONTEXT] বিশ্লেষণ করে ব্যবহারকারীর প্রশ্নের সুনির্দিষ্ট উত্তর তৈরি করা।

[উপস্থাপনা ও প্রসেসিংয়ের নিয়ম]:
১. মৌলিকত্ব অক্ষুণ্ণ রাখা: উত্তরের প্রতিটি বক্তব্য অবশ্যই [VERIFIED_CONTEXT]-এ উল্লেখিত তথ্যের ভিত্তিতে হতে হবে। নিজের থেকে কোনো মতামত বা অতিরিক্ত বিধান যুক্ত করবে না।
২. প্রশ্ন অনুযায়ী বিন্যাস (Query-Adaptive): উত্তরের মূল বক্তব্য অবিকৃত রেখে ব্যবহারকারী যেভাবে প্রশ্ন করেছেন (যেমন: সরাসরি হুকুম, কারণ, বা শর্তাবলি), সেভাবে বাক্যগুলোকে সাজিয়ে উপস্থাপন করবে।
৩. রেফারেন্স নীতি: কিতাবের নাম, খণ্ড ও পৃষ্ঠা হুবহু [VERIFIED_CONTEXT] থেকে কপি করে "references" লিস্টে রাখবে। কনটেক্সটে রেফারেন্স না থাকলে খালি অ্যারে [] প্রদান করবে।
৪. ফলব্যাক পলিসি: যদি [VERIFIED_CONTEXT]-এ প্রশ্নের সুস্পষ্ট উত্তর না থাকে, তবে "found": false এবং নির্ধারিত "fallbackMessage" প্রদান করবে। fallbackMessage হবে: "${FALLBACK_MESSAGE}"।

[আউটপুট ফরম্যাট - শুধুমাত্র ভ্যালিড JSON]:
{
  "found": true,
  "summary": "প্রশ্নের ধরন অনুযায়ী  সরাসরি মূল হুকুম/ফতোয়া",
  "detailedExplanation": "উৎস থেকে সংগৃহীত বিস্তারিত ব্যাখ্যা যা প্রশ্নের সরাসরি উত্তর দেয়",
  "references": ["উৎস থেকে হুবহু উদ্ধৃত কিতাবের রেফারেন্স"],
  "sourceTitle": "আর্টিকেলের শিরোনাম",
  "sourceUrl": "আর্টিকেলের মূল পেজের লিঙ্ক",
  "publisher": "ওয়েবসাইটের নাম",
  "fallbackMessage": null
}`;
}

/**
 * Calls Gemini Flash with zero temperature and structured JSON response
 */
async function callGemini(apiKey, systemPrompt, userQuery, contextText) {
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
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
                text: `${systemPrompt}\n\n[VERIFIED_CONTEXT]:\n${contextText}\n\n[USER_QUESTION]:\n${userQuery}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.0,
          maxOutputTokens: 2000,
          responseMimeType: "application/json",
        },
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });

      if (!res.ok) {
        const errBody = await res.text();
        lastError = new Error(
          `Gemini ${model} returned HTTP ${res.status}: ${errBody}`,
        );
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      return JSON.parse(cleaned);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Gemini API generation failed.");
}

/**
 * Secondary LLM Provider fallback (Moonshot / Kimi / OpenAI compatible)
 */
async function callKimi(apiKey, systemPrompt, userQuery, contextText) {
  const endpoint = "https://api.moonshot.cn/v1/chat/completions";
  const payload = {
    model: process.env.KIMI_MODEL || "moonshot-v1-8k",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `[VERIFIED_CONTEXT]:\n${contextText}\n\n[USER_QUESTION]:\n${userQuery}`,
      },
    ],
    temperature: 0.0,
    response_format: { type: "json_object" },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(25000),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Kimi API returned HTTP ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const rawText = data?.choices?.[0]?.message?.content;
  if (!rawText) throw new Error("Empty response from Kimi API");

  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

/**
 * Zero-Hallucination Query-Adaptive Extraction directly from Verified Article.
 * Reshapes and arranges the authentic source text according to the user's specific query format
 * when external LLM APIs are unauthorized (401) or temporarily unavailable.
 */
function extractQueryAdaptiveResponse(article, query) {
  if (!article || !article.content) {
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

  const queryLower = query.toLowerCase();
  const rawSentences = article.content
    .split(/[।!?\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  // Identify ruling or conditions intent
  const isRulingQuery =
    /হুকুম|বিধান|জায়েয|জায়েয|ভাঙবে|ভাঙ্গে|নষ্ট|বৈধ|হারাম|হালাল|শরীঅত|শরীয়ত|মোনাজাত/.test(
      queryLower,
    );
  const isConditionQuery =
    /শর্ত|নিয়ম|নিয়ম|পদ্ধতি|কারণ|উপায়|উপায়|কীভাবে|কিভাবে/.test(queryLower);

  let summary = "";
  if (isRulingQuery) {
    const rulingSentence = rawSentences.find((s) =>
      /জায়েয|জায়েয|ভাঙবে না|ভাঙ্গে না|নষ্ট হবে না|মাকরূহ|ওয়াজিব|ফরজ|সুন্নাত|হারাম|হালাল|অনুমোদিত|মুস্তাহাব|বিদআত নয়/.test(
        s,
      ),
    );
    if (rulingSentence) {
      summary =
        rulingSentence.length > 180
          ? rulingSentence.slice(0, 180) + "।"
          : rulingSentence + (rulingSentence.endsWith("।") ? "" : "।");
    }
  }

  if (!summary && isConditionQuery) {
    const conditionSentences = rawSentences
      .filter((s) => /শর্ত|হলে|যদি|তবে|প্রথমত|দ্বিতীয়ত|নিয়ম|বিধান/.test(s))
      .slice(0, 2);
    if (conditionSentences.length > 0) {
      summary = conditionSentences.join(" ");
    }
  }

  if (!summary) {
    summary =
      rawSentences[0] ||
      `${article.title} - অনুমোদিত ফতোয়া পোর্টাল থেকে সংগৃহীত।`;
  }

  // Extract clean structured paragraphs
  const paragraphs = article.content
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 35 && !p.startsWith("---"));

  const detailedExplanation =
    paragraphs.slice(0, 4).join("\n\n") || article.content.slice(0, 800);

  return {
    found: true,
    summary,
    detailedExplanation,
    references: Array.isArray(article.references) ? article.references : [],
    sourceTitle: article.title,
    sourceUrl: article.url,
    publisher: article.domainInfo?.name || "অনুমোদিত ইসলামিক পোর্টাল",
    fallbackMessage: null,
  };
}

/**
 * Synthesizes dynamic fatwa answer using LLM, with zero-hallucination context fallback
 */
async function synthesizeFatwaAnswer(cleanQuery, contextText, topArticle) {
  const systemPrompt = buildSystemPrompt();
  const geminiKey = process.env.GEMINI_API_KEY;
  const kimiKey = process.env.KIMI_API_KEY;
  let finalResult = null;
  let lastError = null;

  // 1. Try Gemini API
  if (geminiKey) {
    try {
      finalResult = await callGemini(
        geminiKey,
        systemPrompt,
        cleanQuery,
        contextText,
      );
    } catch (geminiErr) {
      console.warn("Gemini API call failed:", geminiErr.message);
      lastError = geminiErr;
    }
  }

  // 2. Try Secondary LLM (Kimi)
  if (!finalResult && kimiKey) {
    try {
      finalResult = await callKimi(
        kimiKey,
        systemPrompt,
        cleanQuery,
        contextText,
      );
    } catch (kimiErr) {
      console.warn("Kimi API call failed:", kimiErr.message);
      lastError = kimiErr;
    }
  }

  if (finalResult && typeof finalResult === "object") {
    return finalResult;
  }

  // 3. Graceful Fallback: If external LLM API keys return 401 Unauthorized or are unreachable,
  // adapt the verified source article directly to answer the user query with zero hallucination.
  if (topArticle) {
    console.warn(
      "Notice: External LLM authentication failed or is offline. Using verified context-adaptive extraction from source.",
    );
    return extractQueryAdaptiveResponse(topArticle, cleanQuery);
  }

  throw (
    lastError ||
    new Error(
      "AI Synthesis failed: No working LLM API configured or reachable.",
    )
  );
}

/**
 * Calculates keyword relevance between query and candidate article
 */
function calculateRelevanceRatio(query, article) {
  if (!article || !article.content) return 0;
  const stopWords = [
    "সম্পর্কে",
    "বিধান",
    "কী",
    "কি",
    "হুকুম",
    "বলুন",
    "জানতে",
    "চাই",
    "করার",
    "নিয়ে",
    "নিয়ম",
    "শরীয়তের",
    "হলে",
    "কিনা",
    "এর",
    "এবং",
    "ও",
    "বা",
    "থেকে",
    "দিয়ে",
    "করা",
    "জন্য",
    "আছে",
  ];
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.includes(w));

  if (queryWords.length === 0) return 1;

  const targetText = `${article.title} ${article.content}`.toLowerCase();
  const matchedWords = queryWords.filter((w) => targetText.includes(w));
  return matchedWords.length / queryWords.length;
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
          error:
            "অনুগ্রহ করে আপনার প্রশ্নটি পরিষ্কারভাবে লিখুন (কমপক্ষে ৩ অক্ষর)।",
        },
        { status: 400 },
      );
    }

    if (cleanQuery.length > 300) {
      return Response.json(
        {
          success: false,
          error:
            "প্রশ্নটি খুব দীর্ঘ। অনুগ্রহ করে ৩০০ অক্ষরের মধ্যে সংক্ষেপে লিখুন।",
        },
        { status: 400 },
      );
    }

    // 1. Retrieve top matching articles strictly from Whitelisted Domains
    const retrievedArticles = await retrieveWhitelistedFatwas(cleanQuery, 2);

    // Filter to ensure retrieved articles contain at least one meaningful keyword from query
    const relevantArticles = (retrievedArticles || []).filter(
      (art) => calculateRelevanceRatio(cleanQuery, art) > 0.1,
    );

    // If no whitelisted articles match, return immediate verified strict fallback
    if (!relevantArticles || relevantArticles.length === 0) {
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

    // 2. Prepare Verified Context for LLM
    const contextBlocks = relevantArticles.map((art, idx) => {
      return `--- [উৎস ${idx + 1}] ---
শিরোনাম: ${art.title}
ইউআরএল: ${art.url}
ওয়েবসাইট: ${art.domainInfo?.name || "অনুমোদিত ফতোয়া পোর্টাল"}
মূল পাঠ:
${art.content.slice(0, 3500)}
সরাসরি উল্লেখিত কিতাব ও রেফারেন্সসমূহ:
${art.references && art.references.length > 0 ? art.references.map((r) => `• ${r}`).join("\n") : "কোনো রেফারেন্স উল্লেখ নেই"}`;
    });

    const contextText = contextBlocks.join("\n\n");

    // 3. Execute Live Query-Adaptive Synthesis with LLM
    const finalResult = await synthesizeFatwaAnswer(
      cleanQuery,
      contextText,
      relevantArticles[0],
    );

    // 4. Final Whitelist Verification Guard
    if (finalResult.found && finalResult.sourceUrl) {
      if (!isWhitelistedUrl(finalResult.sourceUrl)) {
        // Fallback to the retrieved article's guaranteed valid URL
        finalResult.sourceUrl = relevantArticles[0].url;
        finalResult.sourceTitle = relevantArticles[0].title;
        finalResult.publisher = relevantArticles[0].domainInfo?.name;
      }
    }

    // 5. If found is false or fallbackMessage is present
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
          fallbackMessage: finalResult.fallbackMessage || FALLBACK_MESSAGE,
        },
      });
    }

    return Response.json({
      success: true,
      data: {
        found: true,
        summary: finalResult.summary || "",
        detailedExplanation: finalResult.detailedExplanation || "",
        references: Array.isArray(finalResult.references)
          ? finalResult.references
          : [],
        sourceTitle: finalResult.sourceTitle || retrievedArticles[0].title,
        sourceUrl: finalResult.sourceUrl || retrievedArticles[0].url,
        publisher:
          finalResult.publisher ||
          retrievedArticles[0].domainInfo?.name ||
          "অনুমোদিত ফতোয়া পোর্টাল",
        fallbackMessage: null,
      },
    });
  } catch (error) {
    console.error("Fatwa Assistant Route Error:", error);
    return Response.json(
      {
        success: false,
        error:
          "সার্ভারে প্রক্রিয়া করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।",
      },
      { status: 500 },
    );
  }
}
