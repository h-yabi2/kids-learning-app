// lib/voice-pronunciations.ts
// 表示テキスト → VOICEVOX 合成用テキストへの置換マップ。
// アクセント解析が不自然になる単語をここで上書きする。
// ハッシュ計算には影響しない（元の表示テキストでハッシュを取る）。
export const PRONUNCIATION_OVERRIDES: Record<string, string> = {
  ハーモニカ: "ハアモニカ", // 「ハー」が「ワ」に近い解析になるため
};

export function toSynthesisText(text: string): string {
  return PRONUNCIATION_OVERRIDES[text] ?? text;
}
