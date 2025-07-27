import { NextRequest, NextResponse } from "next/server";
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";

// Google Cloud Text-to-Speech クライアントを初期化
let client: TextToSpeechClient;

try {
  client = new TextToSpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  });
} catch (error) {
  console.error("Failed to initialize TTS client:", error);
  throw error;
}

export async function POST(request: NextRequest) {
  try {
    // 環境変数の確認
    console.log(
      "GOOGLE_APPLICATION_CREDENTIALS:",
      process.env.GOOGLE_APPLICATION_CREDENTIALS
    );
    console.log(
      "GOOGLE_CLOUD_PROJECT_ID:",
      process.env.GOOGLE_CLOUD_PROJECT_ID
    );

    const { text, voice = "ja-JP-Neural2-C" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // 音声合成のリクエストを構築
    const synthesisInput: protos.google.cloud.texttospeech.v1.ISynthesisInput =
      {
        text: text,
      };

    const voiceConfig: protos.google.cloud.texttospeech.v1.IVoiceSelectionParams =
      {
        languageCode: "ja-JP",
        name: voice,
      };

    const audioConfig: protos.google.cloud.texttospeech.v1.IAudioConfig = {
      audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
      effectsProfileId: ["headphone-class-device"],
      speakingRate: 1.0, // 話速を少し遅く
      pitch: 3.0, // ピッチを高く
      volumeGainDb: 0, // 音量を標準に
    };

    const request_body: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: synthesisInput,
        voice: voiceConfig,
        audioConfig: audioConfig,
      };

    // 音声合成を実行
    const [response] = await client.synthesizeSpeech(request_body);

    if (!response.audioContent) {
      return NextResponse.json(
        { error: "Failed to synthesize speech" },
        { status: 500 }
      );
    }

    // Base64エンコードされた音声データを返す
    const audioBase64 = response.audioContent.toString("base64");

    return NextResponse.json({
      audio: audioBase64,
      format: "audio/mp3",
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
