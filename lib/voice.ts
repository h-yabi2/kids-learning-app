// lib/voice.ts
import { voicePath } from "./voice-hash";

const audioCache = new Map<string, HTMLAudioElement>();
const preloadedLinks = new Set<string>();
let currentAudio: HTMLAudioElement | null = null;

function fallbackToWebSpeech(text: string, lang = "ja-JP") {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.7;
  u.pitch = 1.2;
  u.volume = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export async function speakText(
  text: string,
  opts?: { lang?: string }
): Promise<void> {
  if (typeof window === "undefined") return;
  const url = voicePath(text);
  try {
    let audio = audioCache.get(url);
    if (!audio) {
      audio = new Audio(url);
      audio.preload = "auto";
      audioCache.set(url, audio);
    } else {
      audio.currentTime = 0;
    }
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    currentAudio = audio;
    await audio.play();
  } catch (err) {
    if (err instanceof DOMException && err.name === "NotAllowedError") {
      return;
    }
    audioCache.delete(url);
    console.warn("[voice] 静的mp3再生に失敗、Web Speechにフォールバック:", text, err);
    fallbackToWebSpeech(text, opts?.lang);
  }
}

export function preloadVoice(texts: string[]): void {
  if (typeof document === "undefined") return;
  for (const text of texts) {
    const url = voicePath(text);
    if (preloadedLinks.has(url)) continue;
    preloadedLinks.add(url);
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "audio";
    link.href = url;
    document.head.appendChild(link);
  }
}
