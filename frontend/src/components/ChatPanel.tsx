import { useState, useEffect, useRef } from "react";
import { useAppStore } from "../store/useAppStore";
import { checkChatStatus, streamChat } from "../lib/api";
import ChatMessage from "./ChatMessage";

export default function ChatPanel() {
  const {
    profile,
    plan,
    chatMessages,
    addChatMessage,
    appendToLastMessage,
    ollamaAvailable,
    setOllamaAvailable,
  } = useAppStore();
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkChatStatus().then(setOllamaAvailable);
  }, [setOllamaAvailable]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const planSummary = plan
    ? `${plan.total_tasks} active tasks across ${Object.keys(plan.categories).length} categories. ${plan.monthly_time_estimate}. Categories: ${Object.entries(plan.categories).map(([k, v]) => `${k}(${v})`).join(", ")}.`
    : "";

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || streaming) return;

    setInput("");
    addChatMessage({ role: "user", content: msg });

    setStreaming(true);
    addChatMessage({ role: "assistant", content: "" });

    try {
      const history = chatMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      for await (const chunk of streamChat(msg, profile, planSummary, history)) {
        appendToLastMessage(chunk);
      }
    } catch (err) {
      appendToLastMessage(
        "\n\n[Error: Could not get response. Is Ollama running?]"
      );
    } finally {
      setStreaming(false);
    }
  };

  if (ollamaAvailable === null) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-gray-400">
        Checking Ollama status...
      </div>
    );
  }

  if (!ollamaAvailable) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-800 mb-2">
            Ollama Not Detected
          </h3>
          <p className="text-sm text-amber-700 mb-4">
            The AI chat feature requires Ollama running locally. Install it to get personalized maintenance advice.
          </p>
          <div className="bg-white rounded-lg p-4 text-sm font-mono space-y-2 text-gray-700">
            <p className="text-gray-500"># Install Ollama</p>
            <p>brew install ollama</p>
            <p className="text-gray-500 mt-2"># Start the server</p>
            <p>ollama serve</p>
            <p className="text-gray-500 mt-2"># Pull the model (in another terminal)</p>
            <p>ollama pull llama3.1:8b</p>
          </div>
          <button
            onClick={() => checkChatStatus().then(setOllamaAvailable)}
            className="mt-4 text-sm text-amber-700 underline hover:text-amber-900"
          >
            Retry connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
      <div className="bg-white rounded-t-xl border border-b-0 p-4">
        <h3 className="font-semibold text-sm">Home Maintenance Advisor</h3>
        <p className="text-xs text-gray-400">
          Powered by Llama 3.1 via Ollama (local)
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white border-x p-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            <p className="mb-2">Ask anything about home maintenance!</p>
            <div className="space-y-1 text-xs">
              <p className="text-gray-300">Try:</p>
              <p>"What's the most important task for an older home?"</p>
              <p>"Can I skip gutter cleaning?"</p>
              <p>"How do I winterize my outdoor faucets?"</p>
            </div>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white rounded-b-xl border p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about home maintenance..."
            disabled={streaming}
            className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={streaming || !input.trim()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {streaming ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
