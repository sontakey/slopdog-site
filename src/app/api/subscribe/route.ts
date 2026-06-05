import { NextResponse } from "next/server";

export const runtime = "nodejs";

const RESEND_API = "https://api.resend.com";
const TURNSTILE_VERIFY_API = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const FROM = "Slopdog <anton@slopdog.com>";
const NOTIFY_TO = ["sameer.sontakey@gmail.com"];
const DEFAULT_AUDIENCE_ID = "3565c412-540b-442d-afdb-a50ee1b626ff";
const DEV_TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";

const BLOCKED_DOMAINS = new Set([
  "a7gi.ru",
  "chameleongroup.co",
  "securitydelta.nl",
]);

const DISPOSABLE_DOMAIN_MARKERS = [
  "10min",
  "guerrilla",
  "mailinator",
  "moakt",
  "sharklasers",
  "tempmail",
  "trashmail",
  "yopmail",
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getDomain(email: string): string {
  return email.split("@").pop() || "";
}

function isSuppressedDomain(email: string): boolean {
  const domain = getDomain(email);
  return BLOCKED_DOMAINS.has(domain) || DISPOSABLE_DOMAIN_MARKERS.some((marker) => domain.includes(marker));
}

type SignupRequest = {
  email: string | null;
  honeypot: string | null;
  turnstileToken: string | null;
};

async function readSignup(req: Request): Promise<SignupRequest> {
  const ct = req.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      const body = await req.json();
      return {
        email: typeof body?.email === "string" ? normalizeEmail(body.email) : null,
        honeypot: typeof body?.website === "string" ? body.website.trim() : null,
        turnstileToken: typeof body?.["cf-turnstile-response"] === "string" ? body["cf-turnstile-response"] : null,
      };
    }
    const form = await req.formData();
    const e = form.get("email");
    const hp = form.get("website");
    const token = form.get("cf-turnstile-response");
    return {
      email: typeof e === "string" ? normalizeEmail(e) : null,
      honeypot: typeof hp === "string" ? hp.trim() : null,
      turnstileToken: typeof token === "string" ? token : null,
    };
  } catch {
    return { email: null, honeypot: null, turnstileToken: null };
  }
}

function clientIp(req: Request): string | null {
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

async function verifyTurnstile(req: Request, token: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY || (process.env.NODE_ENV !== "production" ? DEV_TURNSTILE_SECRET_KEY : "");

  if (!secret) {
    console.error("[subscribe] TURNSTILE_SECRET_KEY missing");
    return false;
  }

  if (!token) {
    console.warn("[subscribe] turnstile token missing");
    return false;
  }

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);

  const ip = clientIp(req);
  if (ip) {
    body.append("remoteip", ip);
  }

  const res = await fetch(TURNSTILE_VERIFY_API, {
    method: "POST",
    body,
  });

  if (!res.ok) {
    console.error("[subscribe] turnstile verification request failed", res.status, await res.text());
    return false;
  }

  const data = await res.json();
  if (!data?.success) {
    console.warn("[subscribe] turnstile failed", data?.["error-codes"] || []);
    return false;
  }

  return true;
}

async function addContact(apiKey: string, audienceId: string, email: string): Promise<Response> {
  return fetch(`${RESEND_API}/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      unsubscribed: false,
    }),
  });
}

async function sendEmail(apiKey: string, body: Record<string, unknown>): Promise<Response> {
  return fetch(`${RESEND_API}/emails`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function POST(req: Request) {
  const { email, honeypot, turnstileToken } = await readSignup(req);

  if (honeypot) {
    console.warn("[subscribe] honeypot triggered");
    return NextResponse.redirect(new URL("/?subscribe=ok", req.url), 303);
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.redirect(new URL("/?subscribe=invalid", req.url), 303);
  }

  if (isSuppressedDomain(email)) {
    console.warn("[subscribe] suppressed domain", getDomain(email));
    return NextResponse.redirect(new URL("/?subscribe=ok", req.url), 303);
  }

  const passedTurnstile = await verifyTurnstile(req, turnstileToken);
  if (!passedTurnstile) {
    return NextResponse.redirect(new URL("/?subscribe=invalid", req.url), 303);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID || DEFAULT_AUDIENCE_ID;

  if (!apiKey) {
    console.error("[subscribe] RESEND_API_KEY missing");
    return NextResponse.redirect(new URL("/?subscribe=error", req.url), 303);
  }

  const now = new Date().toISOString();
  const ua = req.headers.get("user-agent") || "unknown";
  const ref = req.headers.get("referer") || "direct";

  try {
    const contact = await addContact(apiKey, audienceId, email);

    if (!contact.ok && contact.status !== 409) {
      const errText = await contact.text();
      console.error("[subscribe] contact capture failed", contact.status, errText);
      return NextResponse.redirect(new URL("/?subscribe=error", req.url), 303);
    }

    const notify = await sendEmail(apiKey, {
      from: FROM,
      to: NOTIFY_TO,
      subject: `New SLOPDOG subscriber: ${email}`,
      text: [
        `New subscriber to slopdog.com`,
        ``,
        `email: ${email}`,
        `time:  ${now}`,
        `ref:   ${ref}`,
        `ua:    ${ua}`,
        `stored: resend audience ${audienceId}`,
      ].join("\n"),
    });

    if (!notify.ok) {
      const errText = await notify.text();
      console.error("[subscribe] notify failed", notify.status, errText);
      return NextResponse.redirect(new URL("/?subscribe=error", req.url), 303);
    }

    try {
      await sendEmail(apiKey, {
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
          `slopdog`,
          `https://slopdog.com`,
        ].join("\n"),
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
