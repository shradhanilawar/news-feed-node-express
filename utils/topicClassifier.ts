const topicRules: Record<string, string[]> = {
  AI: ['ai', 'openai', 'llm', 'machine learning', 'artificial intelligence', 'chatgpt'],
  Technology: ['software', 'cloud', 'tech', 'startup', 'developer', 'app', 'cybersecurity'],
  Finance: ['stock', 'market', 'fund', 'bank', 'ipo', 'finance', 'investment'],
  Sports: ['match', 'league', 'tournament', 'goal', 'cricket', 'football', 'nba'],
  Politics: ['election', 'minister', 'parliament', 'government', 'policy', 'senate'],
  Health: ['health', 'hospital', 'medicine', 'disease', 'vaccine', 'medical'],
};

export function inferTopicNames(text: string): string[] {
  const normalized = text.toLowerCase();
  const matches = Object.entries(topicRules)
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))
    .map(([topic]) => topic);

  return matches.length ? matches : ['Technology'];
}
