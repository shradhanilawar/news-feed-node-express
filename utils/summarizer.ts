export function generateSummary(input: { title: string; description?: string; content?: string }): string {
  const combined = [input.description, input.content]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!combined) {
    return `${input.title} — quick summary unavailable, but this article has been ingested and tagged for the personalized feed.`;
  }

  const sentences = combined
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join(' ');

  return `${input.title}: ${sentences}`.slice(0, 500);
}
