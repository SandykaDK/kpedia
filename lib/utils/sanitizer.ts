const entityMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => entityMap[character]);
}

export function sanitizeText(value: string, maxLength = 10_000): string {
  return escapeHtml(value.replace(/<[^>]*>/g, "").trim().slice(0, maxLength));
}
