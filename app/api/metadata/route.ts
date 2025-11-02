import { NextRequest } from "next/server";
import * as cheerio from "cheerio";

function absoluteUrl(possibleUrl: string, baseUrl: string): string | undefined {
  if (!possibleUrl) return undefined;
  try {
    return new URL(possibleUrl, baseUrl).toString();
  } catch {
    return undefined;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");

  if (!target) {
    return Response.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(target, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      // Prevent hanging requests
      cache: "no-store",
      redirect: "follow",
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").first().text().trim();

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $("p").first().text().trim();

    const imageRaw =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $("img").first().attr("src") ||
      "";

    const siteName =
      $('meta[property="og:site_name"]').attr("content") ||
      new URL(target).host;

    const image = absoluteUrl(imageRaw, target);

    return Response.json({ url: target, title, description, image, siteName });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ url: target, error: message }, { status: 200 });
  }
}
