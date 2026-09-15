const youtubeHosts = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"]);
const spotifyHosts = new Set(["open.spotify.com"]);

export function isAllowedMediaUrl(value: string, provider: "YOUTUBE" | "SPOTIFY"): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return provider === "YOUTUBE" ? youtubeHosts.has(url.hostname.toLowerCase()) : spotifyHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function validateEmbedUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return url.protocol === "https:" && (youtubeHosts.has(hostname) || spotifyHosts.has(hostname)) ? url : null;
  } catch {
    return null;
  }
}
