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

    let response;
    let data;
    let retries = 3; // সর্বোচ্চ ৩ বার চেষ্টা করবে
    let delay = 2000; // প্রতিবার ব্যর্থ হওয়ার পর ২ সেকেন্ড (২০০০ মিলিসেকেন্ড) অপেক্ষা করবে

    while (retries > 0) {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
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

      data = await response.json();

      // যদি সার্ভারে অতিরিক্ত চাপের কারণে ৪২৯ (Too Many Requests) বা ৫০৩ (Service Unavailable) এরর আসে
      if (response.status === 429 || response.status === 503 || data.error?.code === 429) {
        retries--;
        if (retries > 0) {
          console.warn(`গুগল সার্ভারে চাপ বেশি। ${delay / 1000} সেকেন্ড পর আবার চেষ্টা করা হচ্ছে... বাকি চেষ্টা: ${retries}`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue; // পরের লুপে চলে যাবে এবং আবার চেষ্টা করবে
        }
      }

      // যদি নরমাল কোনো রেসপন্স বা অন্য কোনো এরর আসে, তবে লুপ ভেঙে বের হয়ে যাবে
      break;
    }

    // ৩ বার চেষ্টার পরও যদি গুগল থেকে কোনো এরর অবজেক্ট ব্যাক আসে
    if (data && data.error) {
      console.error("Gemini API Error after retries:", data.error);
      return NextResponse.json({ 
        role: "assistant", 
        content: "গুগল সার্ভারে এই মুহূর্তে অতিরিক্ত ট্রাফিক রয়েছে। অনুগ্রহ করে কয়েক সেকেন্ড পর আবার মেসেজ দিন।" 
      });
    }

    // রেসপন্স সঠিকভাবে চেক করার লজিক
    if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ role: "assistant", content: aiResponse });
    } else {
      console.error("Gemini API unexpected structure:", data);
      return NextResponse.json({ role: "assistant", content: "আমি আপনার প্রশ্নটি বুঝতে পেরেছি, তবে রেসপন্স পেতে কিছুটা সমস্যা হচ্ছে।" });
    }

  } catch (error) {
    console.error("Chat Server Error:", error);
    return NextResponse.json({ role: "assistant", content: "দুঃখিত, সার্ভারে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।" });
  }
}
