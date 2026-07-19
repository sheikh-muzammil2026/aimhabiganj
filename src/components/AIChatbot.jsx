// components/AIChatbot.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "আস-সালামু আলাইকুম! আস-সালাম আইডিয়াল মাদরাসা পোর্টালে আপনাকে স্বাগতম। আমি আপনাকে কীভাবে সাহায্য করতে পারি?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // নতুন মেসেজ আসলে স্বয়ংক্রিয়ভাবে স্ক্রোল ডাউন হওয়ার জন্য
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();
      if (data.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "দুঃখিত, সার্ভারে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পর চেষ্টা করুন।" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ১. ফ্লোটিং চ্যাট বাটন (ডান দিকের হোয়াটসঅ্যাপের ব্যালেন্স করতে এটিকে বাম কোণায় bottom-20 left-6 পজিশনে সেট করা হয়েছে) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Chatbot"
        className="fixed bottom-20 left-6 z-50 bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 rounded-full shadow-[0_4px_20px_rgba(4,120,87,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group  print:hidden"
      >
        {isOpen ? <X className="w-6 h-6 animate-spin-slow" /> : <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
        {!isOpen && (
          <span className="absolute -top-2 -left-1 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-bounce">
            AI
          </span>
        )}
      </button>

      {/* ২. চ্যাট উইন্ডো ইন্টারফেস */}
      {isOpen && (
        /* চ্যাট উইন্ডোটিও এখন বাম পাশে (left-4 sm:left-6) পপ-আপ হবে */
        <div className="fixed bottom-36 left-4 right-4 sm:right-auto sm:w-96 z-50 bg-gradient-to-b from-white to-[#f7fdfa] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-emerald-600/10 overflow-hidden flex flex-col h-[450px] sm:h-[500px] animate-slideUp  print:hidden">

          {/* চ্যাট হেডার (ইসলামিক থিম) */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-600/40 p-2 rounded-xl border border-white/10">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide font-serif">আস-সালাম এআই সহকারী</h4>
                <p className="text-[10px] text-emerald-200/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> অনলাইন পোর্টাল গাইড
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* চ্যাট মেসেজ এরিয়া */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafdfb]">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${msg.role === "user"
                    ? "bg-emerald-700 text-white rounded-bl-none" // বাম পাশে চ্যাট উইন্ডো থাকায় ইউজারের মেসেজ ডানে চ্যাপ্টা হবে
                    : "bg-white text-gray-800 border border-emerald-600/5 rounded-br-none" // এআইয়ের মেসেজ বামে চ্যাপ্টা হবে
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-emerald-600/5 rounded-2xl rounded-br-none p-3 text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* চ্যাট ইনপুট ফর্ম */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-emerald-100 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="মাদরাসা সম্পর্কে কিছু জিজ্ঞাসা করুন..."
              className="flex-1 bg-emerald-50/40 border border-emerald-600/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-gray-800"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 text-white disabled:text-gray-400 p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
