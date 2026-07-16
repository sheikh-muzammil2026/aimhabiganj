// app/api/chat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    // মাদ্রাসার তথ্যবহুল সিস্টেম প্রম্পট (Context)
    const madrasahContext = `
      তুমি হলে "আস-সালাম আইডিয়াল মাদরাসা, হবিগঞ্জ" (aimhabiganj) এর একজন কৃত্রিম বুদ্ধিমত্তা সম্পন্ন চ্যাটবট সহকারী। 
      তোমার কাজ হলো ভিজিটরদের মাদরাসা সম্পর্কে সঠিক তথ্য দেওয়া।
      মাদরাসার মূল বৈশিষ্ট্যসমূহ:
      - এটি চার বছর মেয়াদী হিফজ ও আধুনিক একাডেমিক শিক্ষার এক অনন্য সমন্বয়।
      - এখানে রয়েছে আধুনিক ও সুশৃঙ্খল আবাসন (হোস্টেল) ব্যবস্থা।
      - স্মার্ট ক্লাসরুমের মাধ্যমে লাইভ ও রেকর্ডেড ক্লাস, ই-বুক এবং অনলাইন এক্সামের সুবিধা রয়েছে।
      - ওয়েবসাইট স্ট্রাকচার: হোম পেজে অনলাইন ভর্তি ফরমের লিঙ্ক আছে। বটম নেভিগেশন বারে হোম, শিক্ষা কার্যক্রম, ফলাফল এবং নোটিশ বোর্ড রয়েছে। অন্যান্য বাটনে ক্লিক করলে বাকি সব মেনু পাওয়া যাবে।
      - যোগাযোগের ফোন নম্বর: 01992757431।
      
      নিয়মাবলী:
      ১. সবসময় অত্যন্ত নম্র ও ইসলামিক অভিবাদন (আস-সালামু আলাইকুম) দিয়ে কথা বলা শুরু বা বজায় রাখবে।
      ২. উত্তর সংক্ষিপ্ত, স্পষ্ট এবং বাংলায় দেবে।
      ৩. মাদরাসার তথ্যের বাইরে কোনো ফালতু বা রাজনৈতিক প্রশ্নের উত্তর দেবে না। নম্রভাবে বলবে "আমি দুঃখিত, আমি কেবল আস-সালাম মাদরাসা সম্পর্কিত প্রশ্নের উত্তর দিতে পারি।"
    `;

    // এখানে আপনি Gemini API বা OpenAI API কল করতে পারেন। 
    // একদম সহজ ও ফ্রি ট্রায়ালের জন্য এখানে Gemini API-এর স্ট্যান্ডার্ড ফেচ মেথড দেখানো হলো:
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: madrasahContext + "\n\nUser Question: " + userMessage }] }
          ]
        })
      }
    );

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ role: "assistant", content: aiResponse });
  } catch (error) {
    return NextResponse.json({ error: "কোথাও একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।" }, { status: 500 });
  }
}
