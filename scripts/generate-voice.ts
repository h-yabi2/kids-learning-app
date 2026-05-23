// scripts/generate-voice.ts
import { mkdir, writeFile, access, readdir, unlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { voiceHash } from "../lib/voice-hash";
import { listAllVoiceTexts } from "../lib/voice-texts";

const VOICEVOX_URL = process.env.VOICEVOX_URL ?? "http://localhost:50021";
const SPEAKER_ID = process.env.VOICEVOX_SPEAKER_ID;
const OUT_DIR = resolve(process.cwd(), "public", "voice");

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function checkFfmpeg(): Promise<void> {
  await new Promise<void>((res, rej) => {
    const p = spawn("ffmpeg", ["-version"], { stdio: "ignore" });
    p.on("error", () =>
      rej(
        new Error(
          "ffmpeg が見つかりません。`brew install ffmpeg` 等でインストールしてください。"
        )
      )
    );
    p.on("exit", (code) =>
      code === 0 ? res() : rej(new Error("ffmpeg 実行に失敗"))
    );
  });
}

async function checkVoicevox(): Promise<void> {
  const res = await fetch(`${VOICEVOX_URL}/version`).catch(() => null);
  if (!res || !res.ok) {
    throw new Error(
      `VOICEVOX エンジン (${VOICEVOX_URL}) に接続できません。\n` +
        `Docker で起動: docker run --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest`
    );
  }
}

async function synthesizeWav(text: string): Promise<Buffer> {
  const queryRes = await fetch(
    `${VOICEVOX_URL}/audio_query?speaker=${SPEAKER_ID}&text=${encodeURIComponent(text)}`,
    { method: "POST" }
  );
  if (!queryRes.ok) throw new Error(`audio_query 失敗: ${text}`);
  const query = await queryRes.json();
  const synthRes = await fetch(
    `${VOICEVOX_URL}/synthesis?speaker=${SPEAKER_ID}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "audio/wav" },
      body: JSON.stringify(query),
    }
  );
  if (!synthRes.ok) throw new Error(`synthesis 失敗: ${text}`);
  return Buffer.from(await synthRes.arrayBuffer());
}

async function wavToMp3(wav: Buffer): Promise<Buffer> {
  return await new Promise((res, rej) => {
    const p = spawn("ffmpeg", [
      "-loglevel",
      "error",
      "-i",
      "pipe:0",
      "-codec:a",
      "libmp3lame",
      "-q:a",
      "4",
      "-f",
      "mp3",
      "pipe:1",
    ]);
    const chunks: Buffer[] = [];
    p.stdout.on("data", (c) => chunks.push(c));
    p.on("error", rej);
    p.on("exit", (code) =>
      code === 0
        ? res(Buffer.concat(chunks))
        : rej(new Error(`ffmpeg exit ${code}`))
    );
    p.stdin.end(wav);
  });
}

async function main() {
  if (!SPEAKER_ID) {
    throw new Error(
      "VOICEVOX_SPEAKER_ID が未設定です。.env.local に設定してください。"
    );
  }
  await checkFfmpeg();
  await checkVoicevox();
  await mkdir(OUT_DIR, { recursive: true });

  const texts = listAllVoiceTexts();
  console.log(`対象テキスト ${texts.length} 件 / speaker=${SPEAKER_ID}`);

  const manifest: Record<string, string> = {};
  let generated = 0;
  let skipped = 0;

  for (const text of texts) {
    const hash = voiceHash(text);
    if (manifest[hash] && manifest[hash] !== text) {
      throw new Error(
        `Hash collision detected: "${manifest[hash]}" and "${text}" both hash to ${hash}. ` +
          `Rename one of the source texts or switch to a wider hash.`
      );
    }
    manifest[hash] = text;
    const outPath = resolve(OUT_DIR, `${hash}.mp3`);
    if (await fileExists(outPath)) {
      skipped++;
      continue;
    }
    process.stdout.write(`[gen] ${hash} ${text.slice(0, 20)}…`);
    const wav = await synthesizeWav(text);
    const mp3 = await wavToMp3(wav);
    await writeFile(outPath, mp3);
    generated++;
    process.stdout.write(" ok\n");
  }

  const existing = await readdir(OUT_DIR);
  let pruned = 0;
  for (const file of existing) {
    if (!file.endsWith(".mp3")) continue;
    const hash = file.slice(0, -4);
    if (!manifest[hash]) {
      await unlink(resolve(OUT_DIR, file));
      pruned++;
      console.log(`[prune] ${file}`);
    }
  }

  await writeFile(
    resolve(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  console.log(
    `完了: 生成 ${generated} / スキップ ${skipped} / プルーン ${pruned} / 合計 ${texts.length}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
