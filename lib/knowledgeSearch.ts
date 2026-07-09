import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import type {
  KeywordGroup,
  KeywordGroupName,
  KnowledgeDocument,
  KnowledgeSearchInput,
  KnowledgeSearchResult,
} from './knowledgeTypes.js';

const DEFAULT_LIMIT = 5;

const ACTIVE_MARKDOWN_ROOTS = [
  'knowledge/tours/batur-sunrise',
  'knowledge/policies',
  'knowledge/live-status',
  'knowledge/sales',
  'examples/conversations',
];

const KEYWORD_GROUPS: KeywordGroup[] = [
  {
    name: 'batur',
    keywords: ['батур', 'batur', 'вулкан', 'volcano', 'mount batur', 'гора батур', 'кальдера'],
  },
  {
    name: 'eruption_safety',
    keywords: [
      'извержение',
      'eruption',
      'пепел',
      'ash',
      'дым',
      'smoke',
      'лава',
      'lava',
      'землетрясение',
      'earthquake',
      'безопасно',
      'безопасность',
      'safe',
      'safety',
      'опасно',
      'закрыто',
      'открыт',
      'ограничения',
    ],
  },
  {
    name: 'sunrise_trekking',
    keywords: ['рассвет', 'sunrise', 'восхождение', 'trekking', 'треккинг', 'подъем', 'hike', 'пешком'],
  },
  {
    name: 'jeep_or_no_hike',
    keywords: [
      'джип',
      'jeep',
      'без восхождения',
      'без подъема',
      'не хотим идти пешком',
      'не хочу идти пешком',
      'offroad',
      'off-road',
    ],
  },
  {
    name: 'hot_springs',
    keywords: ['горячие источники', 'источники', 'hot springs', 'купальни', 'термальные источники'],
  },
  {
    name: 'transfer',
    keywords: [
      'трансфер',
      'забрать',
      'отель',
      'pickup',
      'pick up',
      'hotel',
      'from ubud',
      'из убуда',
      'из чангу',
      'из семиньяка',
      'из нуса дуа',
    ],
  },
  {
    name: 'price',
    keywords: ['цена', 'стоимость', 'сколько стоит', 'прайс', 'price', 'cost', 'idr', 'rp'],
  },
  {
    name: 'booking',
    keywords: [
      'забронировать',
      'бронь',
      'доступно',
      'availability',
      'available',
      'book',
      'booking',
      'tomorrow',
      'завтра',
      'today',
      'сегодня',
    ],
  },
  {
    name: 'children_health',
    keywords: [
      'ребенок',
      'дети',
      'child',
      'kids',
      'беременность',
      'pregnant',
      'колени',
      'knees',
      'здоровье',
      'health',
      'пожилые',
      'elderly',
    ],
  },
];

const SPECIAL_INCLUSIONS: Partial<Record<KeywordGroupName, string[]>> = {
  batur: ['knowledge/tours/batur-sunrise/page.md'],
  eruption_safety: ['knowledge/policies/volcano-safety.md', 'knowledge/live-status/batur.md'],
};

const PRICE_OR_BOOKING_INCLUSIONS = [
  'knowledge/policies/price-availability.md',
  'knowledge/policies/booking-rules.md',
];

const HOT_SPRINGS_BOOST_KEYWORDS = ['hot springs', 'горячие источники', 'термальные источники', 'купальни'];
const JEEP_BOOST_KEYWORDS = ['jeep', 'джип', 'без восхождения', 'без подъема'];

const STOP_WORDS = new Set([
  'это',
  'как',
  'или',
  'для',
  'что',
  'если',
  'можно',
  'хотим',
  'есть',
  'нас',
  'мы',
  'на',
  'в',
  'с',
  'и',
  'но',
  'the',
  'and',
  'for',
  'with',
  'from',
  'can',
]);

export function searchKnowledge(input: KnowledgeSearchInput): KnowledgeSearchResult[] {
  const message = input.message.trim();
  const limit = input.limit ?? DEFAULT_LIMIT;

  if (!message || limit <= 0) {
    return [];
  }

  const documents = readActiveMarkdownDocuments();
  const activeGroups = getActiveKeywordGroups(message);
  const queryTokens = getQueryTokens(message);
  const forcedPaths = getForcedPaths(activeGroups);

  return documents
    .map((document) => scoreDocument(document, activeGroups, queryTokens, forcedPaths))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.filePath.localeCompare(b.filePath))
    .slice(0, limit);
}

export function readActiveMarkdownDocuments(projectRoot = process.cwd()): KnowledgeDocument[] {
  return ACTIVE_MARKDOWN_ROOTS.flatMap((relativeRoot) => {
    const absoluteRoot = path.join(projectRoot, relativeRoot);

    if (!existsSync(absoluteRoot)) {
      return [];
    }

    return readMarkdownDocumentsRecursively(absoluteRoot, projectRoot);
  }).sort((a, b) => a.filePath.localeCompare(b.filePath));
}

function readMarkdownDocumentsRecursively(directory: string, projectRoot: string): KnowledgeDocument[] {
  return readdirSync(directory)
    .flatMap((entry) => {
      const absolutePath = path.join(directory, entry);
      const stats = statSync(absolutePath);

      if (stats.isDirectory()) {
        return readMarkdownDocumentsRecursively(absolutePath, projectRoot);
      }

      if (!stats.isFile() || !entry.endsWith('.md')) {
        return [];
      }

      const content = readFileSync(absolutePath, 'utf8');
      const filePath = toProjectRelativePath(absolutePath, projectRoot);

      return [{ filePath, absolutePath, content }];
    });
}

function scoreDocument(
  document: KnowledgeDocument,
  activeGroups: Map<KeywordGroupName, string[]>,
  queryTokens: string[],
  forcedPaths: Set<string>,
): KnowledgeSearchResult {
  const normalizedContent = normalizeText(document.content);
  const normalizedPath = normalizeText(document.filePath);
  const matchedKeywords = new Set<string>();
  let score = 0;

  for (const group of KEYWORD_GROUPS) {
    if (!activeGroups.has(group.name)) {
      continue;
    }

    const contentMatches = group.keywords.filter((keyword) => includesNormalized(normalizedContent, keyword));

    if (contentMatches.length > 0) {
      score += 10;
      for (const keyword of contentMatches) {
        matchedKeywords.add(keyword);
        score += Math.min(countOccurrences(normalizedContent, keyword) * 3, 15);
      }
    }

    for (const messageKeyword of activeGroups.get(group.name) ?? []) {
      matchedKeywords.add(messageKeyword);
    }
  }

  for (const token of queryTokens) {
    if (normalizedContent.includes(token) || normalizedPath.includes(token)) {
      matchedKeywords.add(token);
      score += Math.min(countOccurrences(normalizedContent, token), 3);
    }
  }

  if (forcedPaths.has(document.filePath)) {
    score += 100;
  }

  if (activeGroups.has('hot_springs') && isVariantFile(document.filePath)) {
    const boostMatches = HOT_SPRINGS_BOOST_KEYWORDS.filter((keyword) => includesNormalized(normalizedContent, keyword));
    if (boostMatches.length > 0) {
      score += 30;
      boostMatches.forEach((keyword) => matchedKeywords.add(keyword));
    }
  }

  if (activeGroups.has('jeep_or_no_hike') && isVariantFile(document.filePath)) {
    const boostMatches = JEEP_BOOST_KEYWORDS.filter((keyword) => includesNormalized(normalizedContent, keyword));
    if (boostMatches.length > 0) {
      score += 30;
      boostMatches.forEach((keyword) => matchedKeywords.add(keyword));
    }
  }

  if (isAuditFile(document.filePath)) {
    score -= 100;
  }

  return {
    filePath: document.filePath,
    score,
    matchedKeywords: Array.from(matchedKeywords).sort((a, b) => a.localeCompare(b)),
    content: document.content,
  };
}

function getActiveKeywordGroups(message: string): Map<KeywordGroupName, string[]> {
  const normalizedMessage = normalizeText(message);
  const matches = new Map<KeywordGroupName, string[]>();

  for (const group of KEYWORD_GROUPS) {
    const matchedKeywords = group.keywords.filter((keyword) => includesNormalized(normalizedMessage, keyword));

    if (matchedKeywords.length > 0) {
      matches.set(group.name, matchedKeywords);
    }
  }

  return matches;
}

function getForcedPaths(activeGroups: Map<KeywordGroupName, string[]>): Set<string> {
  const forcedPaths = new Set<string>();

  for (const [groupName, filePaths] of Object.entries(SPECIAL_INCLUSIONS) as [KeywordGroupName, string[]][]) {
    if (activeGroups.has(groupName)) {
      filePaths.forEach((filePath) => {
        if (existsSync(filePath)) {
          forcedPaths.add(filePath);
        }
      });
    }
  }

  if (activeGroups.has('price') || activeGroups.has('booking')) {
    PRICE_OR_BOOKING_INCLUSIONS.forEach((filePath) => {
      if (existsSync(filePath)) {
        forcedPaths.add(filePath);
      }
    });
  }

  return forcedPaths;
}

function getQueryTokens(message: string): string[] {
  return Array.from(
    new Set(
      normalizeText(message)
        .split(/[^\p{L}\p{N}]+/u)
        .filter((token) => token.length >= 3 && !STOP_WORDS.has(token)),
    ),
  );
}

function normalizeText(value: string): string {
  return value.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е');
}

function includesNormalized(normalizedHaystack: string, keyword: string): boolean {
  return keywordMatches(normalizedHaystack, keyword);
}

function countOccurrences(normalizedHaystack: string, keyword: string): number {
  const normalizedKeyword = normalizeText(keyword);

  if (normalizedKeyword.includes(' ')) {
    return keywordMatches(normalizedHaystack, keyword) ? countNeedleOccurrences(normalizedHaystack, normalizedKeyword) || 1 : 0;
  }

  return Math.max(...getKeywordNeedles(keyword).map((needle) => countNeedleOccurrences(normalizedHaystack, needle)));
}

function countNeedleOccurrences(normalizedHaystack: string, normalizedNeedle: string): number {
  let count = 0;
  let index = normalizedHaystack.indexOf(normalizedNeedle);

  while (index !== -1) {
    count += 1;
    index = normalizedHaystack.indexOf(normalizedNeedle, index + normalizedNeedle.length);
  }

  return count;
}

function getKeywordNeedles(keyword: string): string[] {
  const normalizedKeyword = normalizeText(keyword);
  const needles = new Set([normalizedKeyword]);
  const stemmedTokens = getKeywordTokenNeedles(normalizedKeyword);

  stemmedTokens.forEach((token) => {
    if (token.length >= 3) {
      needles.add(token);
    }
  });

  if (stemmedTokens.length > 1) {
    needles.add(stemmedTokens.join(' '));
  }

  return Array.from(needles);
}

function keywordMatches(normalizedHaystack: string, keyword: string): boolean {
  const normalizedKeyword = normalizeText(keyword);

  if (normalizedHaystack.includes(normalizedKeyword)) {
    return true;
  }

  if (normalizedKeyword.includes(' ')) {
    return getKeywordTokenNeedles(normalizedKeyword).every((needle) => normalizedHaystack.includes(needle));
  }

  return getKeywordNeedles(keyword).some((needle) => normalizedHaystack.includes(needle));
}

function getKeywordTokenNeedles(normalizedKeyword: string): string[] {
  return normalizedKeyword.split(/\s+/).map((token) => {
    if (/^[а-я]+$/u.test(token) && token.length >= 6) {
      return token.slice(0, -2);
    }

    return token;
  });
}

function isVariantFile(filePath: string): boolean {
  return filePath.includes('knowledge/tours/batur-sunrise/variants/');
}

function isAuditFile(filePath: string): boolean {
  return filePath.endsWith('/audit.md');
}

function toProjectRelativePath(absolutePath: string, projectRoot: string): string {
  return path.relative(projectRoot, absolutePath).split(path.sep).join('/');
}
