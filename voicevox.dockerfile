# VOICEVOX ENGINE用のDockerfile
FROM voicevox/voicevox_engine:latest

# ポート50021を公開
EXPOSE 50021

# CORS設定を追加
ENV VOICEVOX_CORS_POLICY_MODE=1

# 起動コマンド
CMD ["python", "./run.py", "--host", "0.0.0.0", "--port", "50021", "--cors_policy_mode", "1"]