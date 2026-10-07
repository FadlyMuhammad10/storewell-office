"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  CreditCard,
  LockKeyhole,
  MessageCircle,
  Mic,
  Minus,
  RotateCcw,
  Send,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const apiBase = (process.env.NEXT_PUBLIC_API || "/api").replace(/\/+$/, "");
const chatTransport = new DefaultChatTransport({
  api: `${apiBase}/chat/stream`,
  credentials: "include",
});

const suggestions = [
  {
    label: "Cara Checkout",
    icon: ShoppingCart,
    prompt: "Bagaimana cara melakukan checkout di Storewell?",
  },
  {
    label: "Pembayaran",
    icon: CreditCard,
    prompt: "Metode pembayaran apa saja yang tersedia di Storewell?",
  },
  {
    label: "Pengiriman",
    icon: Truck,
    prompt: "Bagaimana proses dan pilihan pengiriman di Storewell?",
  },
  {
    label: "Refund & Retur",
    icon: RotateCcw,
    prompt: "Bagaimana kebijakan refund dan retur di Storewell?",
  },
];

function getMessageText(parts: Array<{ type: string; text?: string }>) {
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error } = useChat({
    transport: chatTransport,
  });
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput("");
  }

  function chooseSuggestion(prompt: string) {
    sendMessage({ text: prompt });
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Buka Storewell Concierge"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition hover:scale-105 hover:bg-[#222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:bottom-7 sm:right-7"
      >
        <MessageCircle className="size-6" aria-hidden="true" />
        <span className="absolute right-0 top-0 size-3.5 rounded-full border-2 border-white bg-emerald-500" />
      </button>
    );
  }

  return (
    <section
      aria-label="Storewell Concierge chat"
      className="fixed bottom-3 right-3 z-50 flex h-[min(690px,calc(100dvh-24px))] w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white text-[#171717] shadow-[0_18px_70px_rgba(0,0,0,0.24)] sm:bottom-6 sm:right-6"
    >
      <header className="flex h-[66px] shrink-0 items-center gap-3 bg-black px-4 text-white">
        <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
          SW
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-black bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold">
              Storewell Concierge
            </h2>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-white/90">
              AI STYLIST
            </span>
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/65">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Online ·
            Siap membantu gaya Anda
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Minimalkan chat"
          className="rounded p-1 text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Tutup chat"
          className="rounded p-1 text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col bg-[#fbf9f9]">
        <div className="flex justify-center px-3 pt-3">
          <div className="flex items-center gap-1.5 rounded-full bg-[#f1f0ef] px-3 py-1.5 text-[10px] text-[#686868]">
            <LockKeyhole className="size-3" aria-hidden="true" /> Enkripsi
            privat · Asisten belanja cerdas Storewell
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-3 pb-3 pt-4 sm:px-4">
          {messages.length === 0 && (
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                SW
              </div>
              <div className="max-w-[calc(100%-40px)] rounded-2xl rounded-tl-md border border-black/6 bg-white px-3.5 py-3 text-[13px] leading-[1.65] shadow-sm">
                **Halo! 👋 Selamat datang di Storewell.** Lagi cari sesuatu?
                Saya bisa bantu menemukan produk, menjawab pertanyaan tentang
                Storewell, atau membantu proses belanja Anda.
              </div>
            </div>
          )}

          {messages.map((message) => {
            const text = getMessageText(message.parts);
            if (!text) return null;
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${isUser ? "justify-end" : ""}`}
              >
                {!isUser && (
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                    SW
                  </div>
                )}
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.65] ${isUser ? "rounded-tr-md bg-black text-white" : "rounded-tl-md border border-black/6 bg-white shadow-sm"}`}
                >
                  {text}
                </div>
              </div>
            );
          })}

          {isBusy && messages.at(-1)?.role !== "assistant" && (
            <div
              className="flex items-center gap-2 text-xs text-[#777]"
              role="status"
              aria-label="Concierge sedang mengetik"
            >
              <div className="flex size-7 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                SW
              </div>
              <span className="animate-pulse">Concierge sedang mengetik…</span>
            </div>
          )}

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 pl-9 pt-1">
              {suggestions.map(({ label, icon: Icon, prompt }) => (
                <button
                  key={label}
                  type="button"
                  disabled={isBusy}
                  onClick={() => chooseSuggestion(prompt)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#dedbd8] bg-white px-2.5 py-1.5 text-[10px] text-[#222] transition hover:border-black hover:bg-[#f5f3f3] disabled:opacity-50"
                >
                  <Icon className="size-3 text-[#767676]" aria-hidden="true" />{" "}
                  {label}
                </button>
              ))}
            </div>
          )}

          {error && (
            <p role="alert" className="ml-9 text-xs text-red-600">
              Pesan belum terkirim. Coba lagi sebentar lagi.
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="shrink-0 bg-white px-2.5 pb-2.5 pt-2">
          <form
            onSubmit={submitMessage}
            className="flex items-center gap-2 rounded-xl bg-[#f5f4f3] p-2"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ketik pesan atau tanyakan gaya..."
              aria-label="Pesan untuk Concierge"
              className="min-w-0 flex-1 bg-transparent px-1.5 py-1 text-xs text-[#222] outline-none placeholder:text-[#858585]"
            />
            <button
              type="button"
              aria-label="Rekam pesan suara"
              title="Pesan suara segera hadir"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#555] hover:bg-black/5"
            >
              <Mic className="size-4" aria-hidden="true" />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isBusy}
              aria-label="Kirim pesan"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="size-3.5" aria-hidden="true" />
            </button>
          </form>
          <p className="pt-2 text-center text-[9px] text-[#888]">
            Didukung AI Storewell · Respons instan 24/7
          </p>
        </div>
      </div>
    </section>
  );
}
