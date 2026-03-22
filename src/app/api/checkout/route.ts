import { NextResponse } from "next/server";

// Product catalog — prices in cents
const PRODUCTS: Record<string, { name: string; description: string; unitAmount: number; digital: boolean }> = {
  // Merch
  "vibe-coder-tee": { name: "Vibe Coder Tee", description: "SLOPDOG merch — Vibe Coder Tee", unitAmount: 3900, digital: false },
  "vibe-coder-tee-alt": { name: "Vibe Coder Tee (Alt)", description: "SLOPDOG merch — Vibe Coder Tee (Alt colorway)", unitAmount: 3900, digital: false },
  "context-window-tee": { name: "Context Window Tee", description: "SLOPDOG merch — Context Window Tee", unitAmount: 3900, digital: false },
  "poisonous-mushroom-tee": { name: "Poisonous Mushroom Tee", description: "SLOPDOG merch — Poisonous Mushroom Tee", unitAmount: 3900, digital: false },
  "gpt-therapy-tee": { name: "GPT Therapy Tee", description: "SLOPDOG merch — GPT Therapy Tee", unitAmount: 3900, digital: false },
  "vibe-coder-beanie": { name: "Vibe Coder Beanie", description: "SLOPDOG merch — Vibe Coder Beanie", unitAmount: 2900, digital: false },
  "ignore-all-previous-instructions-beanie": { name: "Ignore All Previous Instructions Beanie", description: "SLOPDOG merch — Ignore All Previous Instructions Beanie", unitAmount: 2900, digital: false },
  "ignore-all-previous-instructions-cap": { name: "Ignore All Previous Instructions Cap", description: "SLOPDOG merch — Ignore All Previous Instructions Cap", unitAmount: 3200, digital: false },
  // Digital
  "stem-pack-vol-1": { name: "Slopdog Stem Pack Vol. 1", description: "All 3 Slopdog tracks as stems (vocals, instrumentals, acapella). Remix, sample, go wild. License included.", unitAmount: 999, digital: true },
  "beat-license-basic": { name: "Slopdog Beat License (Basic)", description: "Basic license to use Slopdog beats in personal/non-commercial projects.", unitAmount: 1999, digital: true },
  "beat-license-commercial": { name: "Slopdog Beat License (Commercial)", description: "Commercial license to use Slopdog beats in monetized or commercial projects.", unitAmount: 4999, digital: true },
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const product = String(body?.product ?? "").trim();
    const size = String(body?.size ?? "").trim();
    const trackSlug = String(body?.trackSlug ?? "").trim();

    if (!product) {
      return NextResponse.json({ error: "Product is required" }, { status: 400 });
    }

    const productInfo = PRODUCTS[product];
    if (!productInfo) {
      return NextResponse.json({ error: `Unknown product: ${product}` }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("[checkout] STRIPE_SECRET_KEY is not set");
      return NextResponse.json({ error: "Payment service is not configured" }, { status: 503 });
    }

    const siteUrl = (
      process.env.SITE_URL ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://slopdog.com"
    )
      .trim()
      .replace(/\/$/, "");

    // Build product name with size if applicable
    let productName = productInfo.name;
    if (size && !productInfo.digital) {
      productName = `${productInfo.name} — Size: ${size}`;
    }
    if (trackSlug && product.startsWith("beat-license")) {
      productName = `${productInfo.name} — ${trackSlug}`;
    }

    // Success URL varies by product type
    const successParams = new URLSearchParams({ product });
    if (productInfo.digital) successParams.set("digital", "1");
    if (trackSlug) successParams.set("track", trackSlug);

    const successUrl = `${siteUrl}/success?${successParams.toString()}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = product.startsWith("beat-license") && trackSlug
      ? `${siteUrl}/music/${trackSlug}`
      : productInfo.digital && product === "stem-pack-vol-1"
        ? `${siteUrl}/products/stem-pack`
        : `${siteUrl}/merch`;

    // Use Stripe REST API directly (SDK has issues on some Vercel deployments)
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][product_data][name]", productName);
    params.append("line_items[0][price_data][product_data][description]", productInfo.description);
    params.append("line_items[0][price_data][unit_amount]", String(productInfo.unitAmount));
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", successUrl);
    params.append("cancel_url", cancelUrl);
    params.append("metadata[product]", product);
    if (size) params.append("metadata[size]", size);
    if (trackSlug) params.append("metadata[trackSlug]", trackSlug);
    if (productInfo.digital) params.append("metadata[digital]", "true");
    // Collect email at Stripe checkout
    params.append("billing_address_collection", productInfo.digital ? "auto" : "required");

    if (!productInfo.digital) {
      params.append("shipping_address_collection[allowed_countries][0]", "US");
      params.append("shipping_address_collection[allowed_countries][1]", "CA");
      params.append("shipping_address_collection[allowed_countries][2]", "GB");
      params.append("shipping_address_collection[allowed_countries][3]", "AU");
    }

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("[checkout] Stripe error:", JSON.stringify(data));
      return NextResponse.json(
        { error: data?.error?.message ?? "Payment service error" },
        { status: resp.status >= 500 ? 502 : 400 },
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[checkout] Error:", message);
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }
}
