import { searchKnowledge } from '../lib/knowledgeSearch.js';

const testMessages = [
  'Хотим на Батур, но слышали про извержение. Это безопасно?',
  'Можно на Батур без восхождения, например на джипе?',
  'Есть вариант Батура с горячими источниками?',
  'Сколько стоит восхождение на Батур завтра?',
  'Можно ли на Батур с ребенком 7 лет?',
  'Хотим встретить рассвет на Батуре, нас двое, живем в Убуде',
];

for (const message of testMessages) {
  const results = searchKnowledge({ message });

  console.log(`\nСообщение: ${message}`);
  console.log(
    JSON.stringify(
      results.map((result) => ({
        filePath: result.filePath,
        score: result.score,
        matchedKeywords: result.matchedKeywords,
        contentPreview: result.content.replace(/\s+/g, ' ').slice(0, 180),
      })),
      null,
      2,
    ),
  );
}
