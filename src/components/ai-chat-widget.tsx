"use client";

import {
  Bot,
  Calculator,
  ChevronRight,
  Headset,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const introMessage: ChatMessage = {
  id: "intro",
  role: "assistant",
  content:
    "Hi, I can point you to the right Hungary visa route. The fastest way is to complete the calculator first, then I can help you understand what to do next.",
};

const quickPrompts = [
  "Start the calculator",
  "Which visa fits me?",
  "I am not sure where to begin",
  "I need human help",
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildWhatsAppUrl(messages: ChatMessage[]) {
  const configuredNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^\d]/g, "");
  const recent = messages
    .filter((message) => message.role === "user")
    .slice(-3)
    .map((message) => `- ${message.content}`)
    .join("\n");

  const text = encodeURIComponent(
    `Hello VisaHungary, I would like a consultant review.\n\nWebsite chat summary:\n${recent || "- New website visitor"}\n\nPage: ${typeof window !== "undefined" ? window.location.href : ""}`,
  );

  if (!configuredNumber) {
    return `https://wa.me/?text=${text}`;
  }

  return `https://wa.me/${configuredNumber}?text=${text}`;
}

function getCalculatorHref() {
  if (typeof window === "undefined") return "/en/calculator";

  const locale = window.location.pathname.split("/").filter(Boolean)[0];
  return locale === "zh" ? "/zh/calculator" : "/en/calculator";
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([introMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const whatsappUrl = useMemo(() => buildWhatsAppUrl(messages), [messages]);
  const calculatorHref = getCalculatorHref();

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setHasError(false);
    setInput("");
    setIsOpen(true);

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.id !== "intro")
            .map(({ role, content }) => ({ role, content })),
          sourcePage: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat failed");
      }

      const data = (await response.json()) as { reply?: string };
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content:
            data.reply ??
            "Please start with the VisaHungary calculator first. It can capture your situation in the right order and prepare your likely route by email. Use WhatsApp only if the case is urgent, refused, or needs human review.",
        },
      ]);
    } catch {
      setHasError(true);
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content:
            "The chat is having trouble right now. The best next step is still to complete the calculator first. If you have an urgent deadline, refusal, or filed documents, you can use WhatsApp for human help.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="ai-chat-widget" data-open={isOpen}>
      {isOpen ? (
        <section className="ai-chat-panel" aria-label="Ask VisaHungary AI chat">
          <header className="ai-chat-header">
            <span className="ai-chat-avatar" aria-hidden="true">
              <Bot size={18} />
            </span>
            <div>
              <strong>Ask VisaHungary AI</strong>
              <span>Start with the calculator, then ask for help</span>
            </div>
            <button
              type="button"
              className="ai-chat-icon-button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </header>

          <div className="ai-chat-messages">
            {messages.map((message) => (
              <div className="ai-chat-message" data-role={message.role} key={message.id}>
                {message.content}
              </div>
            ))}
            {isLoading ? (
              <div className="ai-chat-message" data-role="assistant">
                <Loader2 size={15} className="ai-chat-spin" />
                Checking whether the calculator or human help is the best next step...
              </div>
            ) : null}
          </div>

          <div className="ai-chat-prompts" aria-label="Quick questions">
            {quickPrompts.map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => void sendMessage(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>

          <a className="ai-chat-calculator" href={calculatorHref}>
            <Calculator size={17} />
            Start the visa calculator
            <ChevronRight size={16} />
          </a>

          <a className="ai-chat-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
            <Headset size={17} />
            Need a human? Continue on WhatsApp
          </a>

          <form className="ai-chat-form" onSubmit={submit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask, or start the calculator"
              aria-label="Ask, or start the calculator"
            />
            <button type="submit" aria-label="Send message" disabled={!input.trim() || isLoading}>
              {isLoading ? <Loader2 size={17} className="ai-chat-spin" /> : <Send size={17} />}
            </button>
          </form>

          <p className="ai-chat-note" data-error={hasError}>
            <ShieldCheck size={14} />
            Best first step: complete the calculator. Use WhatsApp only for urgent or document-heavy
            cases. Do not send passport, banking, or document data here.
          </p>
        </section>
      ) : null}

      <button
        type="button"
        className="ai-chat-launcher"
        aria-label="Open Ask VisaHungary AI chat"
        onClick={() => setIsOpen(true)}
      >
        <span>
          <Sparkles size={16} />
          Ask VisaHungary AI
        </span>
        <MessageCircle size={21} />
      </button>
    </div>
  );
}
