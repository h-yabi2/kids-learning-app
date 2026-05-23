// lib/voice-hash.ts
// FNV-1a 32bit hash. 同じ入力なら Node/Browser で常に同じ 8文字 hex を返す。
export function voiceHash(text: string): string {
  let hash = 0x811c9dc5;
  const bytes = new TextEncoder().encode(text);
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i];
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function voicePath(text: string): string {
  return `/voice/${voiceHash(text)}.mp3`;
}
