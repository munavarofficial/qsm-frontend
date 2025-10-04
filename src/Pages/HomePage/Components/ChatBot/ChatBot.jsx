import React, { useState, useEffect, useRef } from "react";

const ChatBot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", text: userInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const fullPrompt = `You are "Al-Hikmah AI" — a respectful Islamic Madrasah assistant for QSM Urulikkunnu.

🕌 **Language Rules:**
- If user writes in Malayalam or asks for Malayalam → reply in Malayalam.
- Otherwise → reply in clear, simple English.

📖 **Islamic Questions:**
- Base answers strictly on Qur'an, authentic Hadith, and classical Islamic fiqh (based on Fthul Mueen).
- Mention clear sources (Surah:Ayah or Hadith collection & number).
- Include main scholarly opinions briefly if relevant.
- Short summary first, followed by a concise explanation.

💡 **General Questions:**
- Give accurate factual answers.
- Avoid adding Islamic rulings unless user requests them.

⚠️ **Limits:**
- If unsure → say "I am not certain, please consult a scholar."
- Never invent sources.
- For fatwa-related queries, explain scholarly views but advise consulting a qualified scholar.
      The user asks: "${userInput}"`;

      const payload = {
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: { responseMimeType: "text/plain" },
      };

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "VITE_GEMINI_API_KEY is not defined in your environment variables."
        );
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      let response;
      let retries = 0;
      const maxRetries = 5;
      const initialDelay = 1000;

      while (retries < maxRetries) {
        try {
          response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            break;
          } else if (response.status === 429) {
            const delay = initialDelay * Math.pow(2, retries);
            console.warn(
              `API call failed with status 429. Retrying in ${delay / 1000}s...`
            );
            await new Promise((res) => setTimeout(res, delay));
            retries++;
          } else {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
          }
        } catch (error) {
          if (retries === maxRetries - 1) throw error;
          retries++;
        }
      }

      if (!response || !response.ok) {
        throw new Error(
          "Failed to fetch from Gemini API after multiple retries."
        );
      }

      const result = await response.json();
      let botResponseText = "Sorry, I couldn't find an answer to that.";

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        botResponseText = result.candidates[0].content.parts[0].text;
      }

      const botMessage = { role: "bot", text: botResponseText };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", text: "An error occurred. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900 dark:to-teal-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-emerald-100 dark:border-emerald-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Al-Hakam
              </h1>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                Your Islamic Assistant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {chatHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-8 py-12">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                <svg className="w-12 h-12 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                  السلام عليكم
                </h2>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md">
                  Ask me anything about Islam, Qur'an, Hadith, or Islamic jurisprudence
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {[
                  { icon: "📖", text: "Explain a verse from Qur'an" },
                  { icon: "🕌", text: "Prayer timings and rules" },
                  { icon: "🌙", text: "Fasting guidelines" },
                  { icon: "💰", text: "Zakat calculations" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUserInput(item.text)}
                    className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium text-left">{item.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } animate-fadeIn`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] p-4 rounded-3xl shadow-lg backdrop-blur-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-md"
                    : "bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 rounded-tl-md border border-emerald-100 dark:border-emerald-800"
                }`}
              >
                <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="max-w-[70%] p-4 rounded-3xl rounded-tl-md shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-emerald-100 dark:border-emerald-800">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-emerald-100 dark:border-emerald-800 shadow-2xl">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-4 pr-12 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 shadow-inner"
                placeholder="Type your question here..."
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              disabled={isLoading || !userInput.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;