import { NextRequest, NextResponse } from "next/server";

// 音声キャッシュ用のメモリストレージ
const audioCache = new Map<string, { audio: ArrayBuffer; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24時間

// VOICEVOXサーバーのURL
const VOICEVOX_BASE_URL = process.env.VOICEVOX_URL || "http://localhost:50021";

// 子供向けキャラクター設定
const KIDS_FRIENDLY_SPEAKERS = {
  四国めたん: { speaker: 5, style: "ノーマル" }, // 可愛らしい声
  ずんだもん: { speaker: 3, style: "ノーマル" }, // 子供に人気
  春日部つむぎ: { speaker: 8, style: "ノーマル" }, // 優しい声
  読み聞かせ: { speaker: 31, style: "読み聞かせ" }, // 読み聞かせ専用
  もち子さん: { speaker: 20, style: "ノーマル" }, // 関西弁の優しい声
  剣崎雌雄: { speaker: 7, style: "ノーマル" }, // 落ち着いた声
  春歌ナナ: { speaker: 6, style: "ノーマル" }, // 歌うような優しい声
} as const;

// ひらがな・単語ごとの音声パラメータ設定
const VOICE_PARAMETERS = {
  // 単文字ひらがな（清音）
  あ: {
    speedScale: 0.8,
    pitchScale: 0.0,
    intonationScale: 1.0,
    accentAdjustments: [],
  },
  い: {
    speedScale: 0.8,
    pitchScale: 0.2,
    intonationScale: 1.1,
    accentAdjustments: [],
  },
  う: {
    speedScale: 0.9,
    pitchScale: -0.1,
    intonationScale: 0.9,
    accentAdjustments: [],
  },
  え: {
    speedScale: 0.8,
    pitchScale: 0.1,
    intonationScale: 1.0,
    accentAdjustments: [],
  },
  お: {
    speedScale: 0.9,
    pitchScale: -0.2,
    intonationScale: 1.2,
    accentAdjustments: [],
  },

  // 単語用設定（アクセントを考慮）
  // あいすくりーむ: {
  //   speedScale: 1.0,
  //   pitchScale: 0.5,
  //   intonationScale: 1.0,
  //   accentAdjustments: [
  //     { moraIndex: 0, pitchMultiplier: 0.5 }, // 「あ」を強調
  //     { moraIndex: 1, pitchMultiplier: 0.5 }, // 「い」を少し下げる
  //     { moraIndex: 2, pitchMultiplier: 0.4 }, // 「す」を下げる
  //     { moraIndex: 3, pitchMultiplier: 0.3 }, // 「く」を下げる
  //     { moraIndex: 4, pitchMultiplier: 0.4 }, // 「り」を下げる
  //     { moraIndex: 5, pitchMultiplier: 0.4 }, // 「ー」を下げる
  //     { moraIndex: 6, pitchMultiplier: 0.4 }, // 「む」を下げる
  //   ],
  // },
  // うさぎ: {
  //   speedScale: 0.8,
  //   pitchScale: 0.1,
  //   intonationScale: 1.2,
  //   accentAdjustments: [
  //     { moraIndex: 1, pitchMultiplier: 1.0 }, // 「う」を少し下げる
  //     { moraIndex: 1, pitchMultiplier: 1.4 }, // 「さ」を強調
  //   ],
  // },
  // えぷろん: {
  //   speedScale: 0.8,
  //   pitchScale: 0.1,
  //   intonationScale: 1.2,
  //   accentAdjustments: [
  //     { moraIndex: 1, pitchMultiplier: 1.6 }, // 「え」を少し下げる
  //     { moraIndex: 2, pitchMultiplier: 1.8 }, // 「ぷ」を強調
  //     { moraIndex: 3, pitchMultiplier: 0.8 }, // 「ん」を下げる
  //   ],
  // },
  // おれんじ: {
  //   speedScale: 0.7,
  //   pitchScale: 0.2,
  //   intonationScale: 1.3,
  //   accentAdjustments: [
  //     { moraIndex: 0, pitchMultiplier: 1.1 }, // 「お」を強調
  //     { moraIndex: 3, pitchMultiplier: 0.7 }, // 「じ」を下げる
  //   ],
  // },

  // デフォルト設定
  default: {
    speedScale: 0.9,
    pitchScale: 0.1,
    intonationScale: 1.2,
    accentAdjustments: [],
  },
} as const;

type SpeakerType = keyof typeof KIDS_FRIENDLY_SPEAKERS;

// アクセント調整のタイプ定義
type AccentAdjustment = {
  moraIndex: number;
  pitchMultiplier: number;
};

type VoiceParameter = {
  speedScale: number;
  pitchScale: number;
  intonationScale: number;
  accentAdjustments: readonly AccentAdjustment[];
};

// テキストに応じた音声パラメータを取得する関数
function getVoiceParameters(text: string): VoiceParameter {
  // 完全一致での検索（単語優先）
  if (text in VOICE_PARAMETERS) {
    return VOICE_PARAMETERS[text as keyof typeof VOICE_PARAMETERS];
  }

  // 単文字ひらがなの場合
  if (text.length === 1 && text in VOICE_PARAMETERS) {
    return VOICE_PARAMETERS[text as keyof typeof VOICE_PARAMETERS];
  }

  // デフォルト設定を返す
  return VOICE_PARAMETERS.default;
}

// アクセント句に対してモーラレベルのピッチ調整を適用する関数
async function applyAccentAdjustments(
  audioQuery: any,
  accentAdjustments: readonly AccentAdjustment[]
) {
  try {
    // accent_phrasesが存在する場合のみ処理
    if (
      !audioQuery.accent_phrases ||
      !Array.isArray(audioQuery.accent_phrases)
    ) {
      console.log("accent_phrases not found or invalid format");
      return;
    }

    let globalMoraIndex = 0;

    // 各アクセント句を処理
    for (const accentPhrase of audioQuery.accent_phrases) {
      if (!accentPhrase.moras || !Array.isArray(accentPhrase.moras)) {
        continue;
      }

      // 各モーラを処理
      for (const mora of accentPhrase.moras) {
        // 該当するモーラインデックスの調整を適用
        const adjustment = accentAdjustments.find(
          (adj) => adj.moraIndex === globalMoraIndex
        );

        if (adjustment && typeof mora.pitch === "number") {
          // ピッチを調整（元のピッチに倍数を適用）
          mora.pitch = mora.pitch * adjustment.pitchMultiplier;
          console.log(
            `Applied pitch adjustment to mora ${globalMoraIndex}: ${mora.pitch}`
          );
        }

        globalMoraIndex++;
      }

      // pause_moraが存在する場合もカウント
      if (accentPhrase.pause_mora) {
        globalMoraIndex++;
      }
    }
  } catch (error) {
    console.error("Error applying accent adjustments:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, speaker = "ずんだもん" } = await request.json();
    const typedSpeaker = speaker as SpeakerType;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // キャッシュキーを生成
    const cacheKey = `${text}_${speaker}`;

    // キャッシュから音声データを取得
    const cachedAudio = audioCache.get(cacheKey);
    if (cachedAudio && Date.now() - cachedAudio.timestamp < CACHE_DURATION) {
      console.log("🔄 Using cached VOICEVOX audio for:", text);

      // ArrayBufferをBase64に変換
      const uint8Array = new Uint8Array(cachedAudio.audio);
      const audioBase64 = Buffer.from(uint8Array).toString("base64");

      return NextResponse.json({
        audio: audioBase64,
        format: "audio/wav",
        cached: true,
        speaker: speaker,
      });
    }

    // 選択されたキャラクターの設定を取得
    const speakerConfig = KIDS_FRIENDLY_SPEAKERS[typedSpeaker];
    if (!speakerConfig) {
      return NextResponse.json(
        { error: `Unknown speaker: ${speaker}` },
        { status: 400 }
      );
    }

    console.log(
      `🎤 Generating VOICEVOX audio with ${speaker} (ID: ${speakerConfig.speaker})`
    );

    // Step 1: 音声クエリを生成
    const queryResponse = await fetch(
      `${VOICEVOX_BASE_URL}/audio_query?text=${encodeURIComponent(
        text
      )}&speaker=${speakerConfig.speaker}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!queryResponse.ok) {
      throw new Error(
        `Audio query failed: ${queryResponse.status} ${queryResponse.statusText}`
      );
    }

    const audioQuery = await queryResponse.json();

    // テキストに応じた音声パラメータを取得
    const voiceParams = getVoiceParameters(text);

    // 子供向けに音声パラメータを調整
    audioQuery.speedScale = voiceParams.speedScale;
    audioQuery.pitchScale = voiceParams.pitchScale;
    audioQuery.intonationScale = voiceParams.intonationScale;
    audioQuery.volumeScale = 1.1; // 音量を少し上げる

    // 単語ごとのアクセント調整を適用
    if (
      voiceParams.accentAdjustments &&
      voiceParams.accentAdjustments.length > 0
    ) {
      await applyAccentAdjustments(audioQuery, voiceParams.accentAdjustments);
    }

    // Step 2: 音声合成を実行
    const synthesisResponse = await fetch(
      `${VOICEVOX_BASE_URL}/synthesis?speaker=${speakerConfig.speaker}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(audioQuery),
      }
    );

    if (!synthesisResponse.ok) {
      throw new Error(
        `Synthesis failed: ${synthesisResponse.status} ${synthesisResponse.statusText}`
      );
    }

    // WAV音声データを取得
    const audioBuffer = await synthesisResponse.arrayBuffer();

    // キャッシュに保存
    audioCache.set(cacheKey, {
      audio: audioBuffer,
      timestamp: Date.now(),
    });

    // ArrayBufferをBase64に変換
    const uint8Array = new Uint8Array(audioBuffer);
    const audioBase64 = Buffer.from(uint8Array).toString("base64");

    console.log(`🎵 Generated VOICEVOX audio successfully with ${speaker}`);

    return NextResponse.json({
      audio: audioBase64,
      format: "audio/wav",
      cached: false,
      speaker: speaker,
    });
  } catch (error) {
    console.error("VOICEVOX TTS Error:", error);

    // エラーの種類に応じた詳細な処理
    let errorMessage = "VOICEVOX音声合成に失敗しました";
    let statusCode = 500;

    if (error instanceof Error) {
      if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("fetch failed")
      ) {
        errorMessage = "VOICEVOXサーバーに接続できません";
        statusCode = 503;
      } else if (error.message.includes("Audio query failed")) {
        errorMessage = "音声クエリの生成に失敗しました";
        statusCode = 400;
      } else if (error.message.includes("Synthesis failed")) {
        errorMessage = "音声合成に失敗しました";
        statusCode = 500;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
        fallback: true, // フロントエンドにフォールバック使用を指示
      },
      { status: statusCode }
    );
  }
}
