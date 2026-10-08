import "server-only";

export class WikimediaImageResolutionError extends Error {
  constructor() {
    super("URL halaman berkas Wikimedia tidak dapat diubah menjadi URL gambar.");
    this.name = "WikimediaImageResolutionError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function resolveWikimediaImageUrl(
  imageUrl: string | null | undefined,
): Promise<string | null | undefined> {
  if (!imageUrl) {
    return imageUrl;
  }

  const pageUrl = new URL(imageUrl);
  const hostname = pageUrl.hostname.toLowerCase();
  const isWikiHost =
    hostname === "wikipedia.org" ||
    hostname.endsWith(".wikipedia.org") ||
    hostname === "wikimedia.org" ||
    hostname.endsWith(".wikimedia.org");

  if (!isWikiHost || !pageUrl.pathname.startsWith("/wiki/")) {
    return imageUrl;
  }

  const pageTitle = decodeURIComponent(pageUrl.pathname.slice("/wiki/".length));
  const fileName = /^(?:File|Berkas):(.+)$/i.exec(pageTitle)?.[1];

  if (!fileName) {
    throw new WikimediaImageResolutionError();
  }

  const apiUrl = new URL("https://commons.wikimedia.org/w/api.php");
  apiUrl.search = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "960",
    titles: `File:${fileName}`,
  }).toString();

  let imageInfo: unknown;

  try {
    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "KPedia/0.1 (Wikimedia image URL resolver)" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Wikimedia API returned ${response.status}.`);
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload) || !isRecord(payload.query) || !isRecord(payload.query.pages)) {
      throw new Error("Wikimedia API response did not contain file information.");
    }

    const page = Object.values(payload.query.pages).find(isRecord);
    const imageInfoList = page && Array.isArray(page.imageinfo) ? page.imageinfo : [];
    imageInfo = imageInfoList[0];
  } catch {
    throw new WikimediaImageResolutionError();
  }

  if (!isRecord(imageInfo)) {
    throw new WikimediaImageResolutionError();
  }

  const resolvedUrl =
    typeof imageInfo.thumburl === "string"
      ? imageInfo.thumburl
      : typeof imageInfo.url === "string"
        ? imageInfo.url
        : undefined;

  if (!resolvedUrl) {
    throw new WikimediaImageResolutionError();
  }

  const resolvedImage = new URL(resolvedUrl);
  if (
    resolvedImage.protocol !== "https:" ||
    !["upload.wikimedia.org", "thumb.wikimedia.org"].includes(resolvedImage.hostname)
  ) {
    throw new WikimediaImageResolutionError();
  }

  return resolvedImage.toString();
}
