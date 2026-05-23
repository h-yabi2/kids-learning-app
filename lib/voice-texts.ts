// lib/voice-texts.ts
import { hiraganaData } from "./hiragana-data";
import { katakanaData } from "./katakana-data";

// 1..10 × 1..10 の足し算問題
function additionTexts(): string[] {
  const out: string[] = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = 1; b <= 10; b++) {
      out.push(`${a}たす${b}は？`);
    }
  }
  for (let ans = 2; ans <= 20; ans++) {
    out.push(`せいかい！${ans}`);
    out.push(`ちがいます。こたえは${ans}です。`);
  }
  return out;
}

function characterWordTexts(): string[] {
  return [
    ...hiraganaData.map((i) => i.word),
    ...katakanaData.map((i) => i.word),
  ];
}

const FIXED_PHRASES = ["よくできました！"];

export function listAllVoiceTexts(): string[] {
  return Array.from(
    new Set([...characterWordTexts(), ...additionTexts(), ...FIXED_PHRASES])
  );
}

export const hiraganaSceneTexts = (): string[] => [
  ...hiraganaData.map((i) => i.word),
  ...FIXED_PHRASES,
];
export const katakanaSceneTexts = (): string[] => [
  ...katakanaData.map((i) => i.word),
  ...FIXED_PHRASES,
];
export const additionSceneTexts = (): string[] => additionTexts();
