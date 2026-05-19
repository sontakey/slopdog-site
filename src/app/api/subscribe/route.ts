import { NextResponse } from "next/server";

export const runtime = "nodejs";

const RESEND_API = "https://api.resend.com";
const FROM = "Slopdog <anton@agents.sontakey.com>";
const NOTIFY_TO = "anton@agents.sontakey.com";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function readEmail(req: Request): Promise<string | null> {
  const ct = req.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      const body = await req.json();
      return typeof body?.email === "string" ? body.email.trim() : null;
    }
    const form = await req.formData();
    const e = form.get("email");
    return typeof e === "string" ? e.trim() : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const email = await readEmail(req);

  if (!email || !isValidEmail(email)) {
    return NextResponse.redirect(new URL("/?subscribe=invalid", req.url), 303);
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[subscribe] RESEND_API_KEY missing");
    return NextResponse.redirect(new URL("/?subscribe=error", req.url), 303);
  }

  const now = new Date().toISOString();
  const ua = req.headers.get("user-agent") || "unknown";
  const ref = req.headers.get("referer") || "direct";

  try {
    // 1) Notify Sameer/Anton with the new signup
    const notify = await fetch(`${RESEND_API}/emails`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [NOTIFY_TO],
        subject: `New SLOPDOG subscriber: ${email}`,
        text: [
          `New subscriber to slopdog.com`,
          ``,
          `email: ${email}`,
          `time:  ${now}`,
          `ref:   ${ref}`,
          `ua:    ${ua}`,
        ].join("\n"),
      }),
    });

    if (!notify.ok) {
      const errText = await notify.text();
      console.error("[subscribe] notify failed", notify.status, errText);
      return NextResponse.redirect(new URL("/?subscribe=error", req.url), 303);
    }

    // 2) Welcome the subscriber (best-effort, non-blocking on failure)
    try {
      await fetch(`${RESEND_API}/emails`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: [email],
          subject: "you tapped the signal",
          text: [
            `you're on the SLOPDOG list.`,
            ``,
            `early access to drops, hidden tracks, and the strange behind-the-scenes ai output that didn't make the cut.`,
            ``,
            `no spam. unsubscribe whenever.`,
            ``,
            `— slopdog`,
            `https://slopdog.com`,
          ].join("\n"),
        }),
      });
    } catch (e) {
      console.warn("[subscribe] welcome email failed", e);
    }

    return NextResponse.redirect(new URL("/?subscribe=ok", req.url), 303);
  } catch (e) {
    console.error("[subscribe] unhandled", e);
    return NextResponse.redirect(new URL("/?subscribe=error", req.url), 303);
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "subscribe" });
}
