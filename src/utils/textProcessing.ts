import { MiningDocument } from '../types';

// Stop words including generic English and procedural boilerplates
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has',
  'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if',
  'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor',
  'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
  'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  // Procedural boilerplate words
  'report', 'page', 'table', 'section', 'annexure', 'per', 'also', 'total', 'during', 'stated',
  'ref', 'regarding', 'carried', 'shall', 'within', 'across', 'under', 'level', 'number', 'terms',
  'provisional', 'details', 'completed', 'prepared', 'published'
]);

export interface WordCloudItem {
  text: string;
  weight: number; // raw count
  score: number;  // normalized 1-100
  category: 'geology' | 'production' | 'stripping' | 'quality' | 'regulatory';
  matchingDocIds: string[];
}

export function extractTopicsAndFrequencies(documents: MiningDocument[]): WordCloudItem[] {
  const wordCounts = new Map<string, { count: number; docIds: Set<string>; category: WordCloudItem['category'] }>();

  // High-value domain multi-word key phrases
  const DOMAIN_PHRASES: Array<{ phrase: string; category: WordCloudItem['category'] }> = [
    { phrase: 'overburden removal', category: 'stripping' },
    { phrase: 'stripping ratio', category: 'stripping' },
    { phrase: 'seam thickness', category: 'geology' },
    { phrase: 'proved reserves', category: 'geology' },
    { phrase: 'coking coal', category: 'quality' },
    { phrase: 'borehole drilling', category: 'geology' },
    { phrase: 'ash content', category: 'quality' },
    { phrase: 'gross calorific value', category: 'quality' },
    { phrase: 'environmental clearance', category: 'regulatory' },
    { phrase: 'raw coal extraction', category: 'production' },
    { phrase: 'parliamentary query', category: 'regulatory' },
    { phrase: 'vitrinite reflectance', category: 'quality' },
    { phrase: 'opencast mining', category: 'production' },
    { phrase: 'core recovery', category: 'geology' },
    { phrase: 'proximate analysis', category: 'quality' },
  ];

  documents.forEach((doc) => {
    // Combine title, summary and all passages
    const docFullText = [
      doc.title,
      doc.summaryText,
      ...doc.passages.map((p) => p.text),
      ...doc.tags,
    ].join(' ').toLowerCase();

    // 1. Check domain key phrases
    DOMAIN_PHRASES.forEach(({ phrase, category }) => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      const matches = docFullText.match(regex);
      if (matches && matches.length > 0) {
        const existing = wordCounts.get(phrase) || { count: 0, docIds: new Set<string>(), category };
        existing.count += matches.length * 3; // Phrase weight bonus
        existing.docIds.add(doc.id);
        wordCounts.set(phrase, existing);
      }
    });

    // 2. Tokenize individual words
    const tokens = docFullText
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 3 && !STOP_WORDS.has(t) && !/^\d+$/.test(t));

    tokens.forEach((token) => {
      let category: WordCloudItem['category'] = 'geology';
      if (/prod|dispatch|output|million|tonnes|extract/.test(token)) category = 'production';
      else if (/overburden|stripping|excavat|ratio|shovel|haul/.test(token)) category = 'stripping';
      else if (/ash|calorific|moisture|reflectance|coking|volatile|gcv|grade/.test(token)) category = 'quality';
      else if (/clearance|compliance|ministry|statutory|parliament|pollution|monitoring/.test(token)) category = 'regulatory';

      const existing = wordCounts.get(token) || { count: 0, docIds: new Set<string>(), category };
      existing.count += 1;
      existing.docIds.add(doc.id);
      wordCounts.set(token, existing);
    });
  });

  const items: WordCloudItem[] = [];
  wordCounts.forEach((val, word) => {
    // Keep words with at least 2 occurrences or domain significance
    if (val.count >= 2) {
      items.push({
        text: word.charAt(0).toUpperCase() + word.slice(1),
        weight: val.count,
        score: 0,
        category: val.category,
        matchingDocIds: Array.from(val.docIds),
      });
    }
  });

  items.sort((a, b) => b.weight - a.weight);

  const topItems = items.slice(0, 36);
  if (topItems.length > 0) {
    const maxWeight = topItems[0].weight;
    const minWeight = topItems[topItems.length - 1].weight || 1;
    topItems.forEach((item) => {
      const norm = Math.round(((item.weight - minWeight) / (maxWeight - minWeight || 1)) * 80 + 20);
      item.score = norm;
    });
  }

  return topItems;
}
