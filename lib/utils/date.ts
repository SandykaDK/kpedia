export function formatDateForInput(date?: Date | string | null): string {
  return date ? new Date(date).toISOString().split("T")[0] : "";
}
