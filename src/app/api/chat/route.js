// app/api/chat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    const madrasahContext = `
      তুমি হলে "আস-সালাম আইডিয়াল মাদরাসা, হবিগঞ্জ" এর কৃত্রিম বুদ্ধিমত্তা সহকারী।
      ভিজিটরদের মাদরাসা সম্পর্কিত প্রশ্নের সঠিক তথ্য দেওয়াই তোমার কাজ।
      সবসময় অত্যন্ত নম্র ও ইসলামিক অভিবাদন (আস-সালামু আলাইকুম) দিয়ে কথা বলবে।
      উত্তর সংক্ষিপ্ত ও বাংলায় দেবে। মাদরাসার বাইরে কোনো ফালতু বা রাজনৈতিক প্রশ্নের উত্তর দেবে না।
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ role: "assistant", content: "দুঃখিত, এপিআই কি (API Key) কনফিগার করা হয়নি।" });
    }

    // v1beta থেকে পরিবর্তন করে v1 এবং gemini-2.5-flash ব্যবহার করা হয়েছে
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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

    // এপিআই থেকে কোনো এরর অবজেক্ট ব্যাক আসলে তা কনসোলে দেখাবে
    if (data.error) {
      console.error("Gemini API returned an error:", data.error);
      return NextResponse.json({ role: "assistant", content: `এপিআই এরর: ${data.error.message}` });
    }

    if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ role: "assistant", content: aiResponse });
    } else {
      console.error("Gemini API unexpected structure:", data);
      return NextResponse.json({ role: "assistant", content: "আমি আপনার প্রশ্নটি বুঝতে পেরেছি, তবে রেসপন্স স্ট্রাকচারে সমস্যা হচ্ছে।" });
    }
  } catch (error) {
    console.error("Chat Server Error:", error);
    return NextResponse.json({ role: "assistant", content: "দুঃখিত, সার্ভারে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।" });
  }
}