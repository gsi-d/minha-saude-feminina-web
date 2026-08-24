export function getYoutubeEmbedUrl(source: unknown): string | null {
  if (typeof source !== "string") {
    return null;
  }

  try {
    const url = new URL(source);
    const hostname = url.hostname.replace(/^www\./, "");
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
      videoId = url.searchParams.get("v");

      if (!videoId && url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/")[2] ?? null;
      }
    }

    return videoId
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`
      : null;
  } catch {
    return null;
  }
}
