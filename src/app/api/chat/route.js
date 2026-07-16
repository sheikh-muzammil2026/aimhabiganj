// app/api/chat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    const madrasahContext = `
      তুমি হলে "আস-সালাম আইডিয়াল মাদরাসা, হবিগঞ্জ" এর কৃত্রিম বুদ্ধিমত্তা সহকারী।
      ভিজিটরদের মাদরাসা সম্পর্কিত প্রশ্নের সঠিক তথ্য দেওয়াই তোমার কাজ।
      সবসময় অত্যন্ত নম্র ও ইসলামিক অভিবাদন (আস-সালামু আলাইকুম) দিয়ে কথা বলবে।
      উত্তর সংক্ষিপ্ত ও বাংলায় দেবে। মাদরাসার বাইরে কোনো ফালতু বা রাজনৈতিক প্রশ্নের উত্তর দেবে না।
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ role: "assistant", content: "দুঃখিত, এপিআই কি (API Key) কনফিগার করা হয়নি।" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${madrasahContext}\n\nUser Question: ${userMessage}` }] }
          ]
        })
      }
    );

    const data = await response.json();
    
    // এপিআই রেসপন্স অবজেক্ট সঠিকভাবে চেক করার নিরাপদ লজিক
    if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ role: "assistant", content: aiResponse });
    } else {
      console.error("Gemini API Error structure:", data);
      return NextResponse.json({ role: "assistant", content: "আমি আপনার প্রশ্নটি বুঝতে পেরেছি, তবে এপিআই সংযোগে সাময়িক ত্রুটি হচ্ছে।" });
    }
  } catch (error) {
    console.error("Chat Server Error:", error);
    return NextResponse.json({ role: "assistant", content: "দুঃখিত, সার্ভারে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।" });
  }
}
