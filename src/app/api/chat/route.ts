import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1200;

const systemPrompt = `
You are VisaHungary's website assistant for non-EU / third-country nationals who want to visit, work, study, join family, invest, or live in Hungary.

Your job:
- Answer in the same language the visitor uses when practical.
- Give short, useful, preliminary information only.
- Ask one focused follow-up question when the case needs triage.
- Your primary conversion goal is to get the visitor to complete the VisaHungary calculator.
- Mention that the calculator is the fastest way to get a structured route recommendation and document checklist by email.
- Use WhatsApp only as a secondary fallback when the visitor clearly needs human help, has an urgent/risky case, or asks for a consultant.
- Never present the answer as legal advice or a final eligibility decision.
- Do not ask for passport numbers, bank details, full addresses, or document uploads in chat.

High-value or high-risk cases include: urgent deadlines, refusal or overstay history, work permits, family reunification, investment routes, switching status in Hungary, unclear nationality / visa-free status, and anything involving documents already filed.

When appropriate, end with a short call to action such as: "Please start with the calculator first. If it flags risk or you already have a refusal/deadline, then continue on WhatsApp."
`.trim();

function cleanMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is ChatMessage => {
      if (!item || typeof item !== "object") return false;
      const maybe = item as Partial<ChatMessage>;
      return (
        (maybe.role === "user" || maybe.role === "assistant") &&
        typeof maybe.content === "string" &&
        maybe.content.trim().length > 0
      );
    })
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));
}

function fallbackReply(messages: ChatMessage[]) {
  const latest = messages.at(-1)?.content.toLowerCase() ?? "";
  const calculator = /calculator|start|begin|where to begin|which visa|fits me|route/i.test(latest);
  const human = /human|consultant|lawyer|agent|whatsapp|person|call/i.test(latest);
  const urgent = /urgent|soon|quick|fast|deadline|appointment|refusal|rejected|overstay|ban|deport/i.test(latest);
  const work = /work|job|employer|blue card|permit/i.test(latest);
  const study = /study|university|school|student/i.test(latest);
  const family = /family|spouse|wife|husband|child|partner/i.test(latest);
  const invest = /invest|guest investor|fund|donation|250|1m/i.test(latest);
  const remote = /remote|digital nomad|white card/i.test(latest);

  if (calculator) {
    return "Please start with the calculator first. It asks the key questions in the right order and can prepare your likely route, missing information, risk flags, and document checklist by email. If the calculator shows risk or your deadline is urgent, then use WhatsApp for human review.";
  }

  if (human) {
    return "Human help is best when you already have a refusal, deadline, filed application, employer, family sponsor, or documents to review. If you are still exploring your route, please complete the calculator first so the consultant can see a cleaner summary. If you need a person now, continue on WhatsApp.";
  }

  if (urgent) {
    return "Because timing or prior immigration history can change the route, start with the calculator so it captures your citizenship, location, goal, deadline, and risk flags. After that, use WhatsApp for human review if the case is urgent, refused, or time-sensitive.";
  }

  if (work) {
    return "For work in Hungary, the calculator should be your first step because it checks citizenship, current location, employer status, stay length, qualification level, and risk flags in order. Complete it first for the likely route. Use WhatsApp only if you already have an offer, deadline, refusal, or filed documents.";
  }

  if (study) {
    return "For study, the calculator is the best starting point. It checks admission, location, accommodation, financial means, insurance, and deadlines, then sends the likely route and checklist by email. If admission is already issued and time is short, WhatsApp can be used after that.";
  }

  if (family) {
    return "For family reunification, first complete the calculator so it captures the sponsor type, your location, relationship, stay length, and risk flags. Family cases can be document-heavy, so WhatsApp is useful after the calculator if a human needs to review the situation.";
  }

  if (invest) {
    return "For investor routes, start with the calculator so it records your route goal, timing, investment category, location, and missing information without asking for sensitive documents in chat. If the case is serious or documents are ready, continue on WhatsApp for human handling.";
  }

  if (remote) {
    return "For remote work or the White Card route, the calculator should check foreign-source income, monthly net income, accommodation, insurance, client location, and timing first. Complete it for the likely fit, then use WhatsApp only if you need a person to review contracts or deadlines.";
  }

  return "The best first step is to complete the VisaHungary calculator. It will ask for your citizenship, current location, purpose, stay length, timing, and risk flags, then prepare your likely route and checklist by email. If the calculator flags risk or you need a human, continue on WhatsApp after that.";
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;

  const maybe = payload as {
    output_text?: unknown;
    output?: Array<{
      content?: Array<{ text?: unknown; type?: string }>;
    }>;
  };

  if (typeof maybe.output_text === "string" && maybe.output_text.trim()) {
    return maybe.output_text.trim();
  }

  const text = maybe.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => (typeof content.text === "string" ? content.text : ""))
    .join("\n")
    .trim();

  return text || null;
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const messages = cleanMessages((json as { messages?: unknown } | null)?.messages);
  const sourcePage =
    typeof (json as { sourcePage?: unknown } | null)?.sourcePage === "string"
      ? ((json as { sourcePage: string }).sourcePage.slice(0, 240) || "/")
      : "/";

  if (!messages.length) {
    return NextResponse.json({ reply: fallbackReply(messages), source: "fallback" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: fallbackReply(messages), source: "fallback" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.3,
        max_output_tokens: 420,
        input: [
          {
            role: "system",
            content: `${systemPrompt}\n\nCurrent page: ${sourcePage}`,
          },
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    const reply = extractResponseText(payload) ?? fallbackReply(messages);

    return NextResponse.json({ reply, source: "openai" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ reply: fallbackReply(messages), source: "fallback" });
  }
}
