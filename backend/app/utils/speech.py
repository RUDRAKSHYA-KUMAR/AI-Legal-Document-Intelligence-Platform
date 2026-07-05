"""
Speech utilities: Text-to-Speech (gTTS) and Speech-to-Text (Gemini).
"""
import io
import tempfile
import os
from gtts import gTTS
def text_to_speech(text: str, lang: str = "en") -> bytes:
    """
    Convert text to speech using gTTS.
    Args:
        text: Text to synthesize
        lang: Language code (default: 'en')
    Returns:
        MP3 audio as bytes
    """
    if not text or not text.strip():
        raise ValueError("Text cannot be empty for TTS conversion.")
    # Truncate very long texts (gTTS has limits)
    max_chars = 5000
    if len(text) > max_chars:
        text = text[:max_chars] + "... (truncated)"
    tts = gTTS(text=text.strip(), lang=lang, slow=False)
    audio_buffer = io.BytesIO()
    tts.write_to_fp(audio_buffer)
    audio_buffer.seek(0)
    return audio_buffer.read()
def speech_to_text_gemini(audio_bytes: bytes, mime_type: str = "audio/wav") -> str:
    """
    Transcribe audio using Gemini's multimodal capability.
    Args:
        audio_bytes: Raw audio file bytes
        mime_type:   MIME type of the audio (e.g. 'audio/wav', 'audio/mp3')
    Returns:
        Transcribed text string
    """
    import google.generativeai as genai
    from app.core.config import settings
    genai.configure(api_key=settings.gemini_api_key)
    # Write to temp file for Gemini upload
    suffix = ".wav" if "wav" in mime_type else ".mp3"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name
    try:
        audio_file = genai.upload_file(tmp_path, mime_type=mime_type)
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content([
            "Transcribe the following audio accurately. Return only the transcribed text, no additional commentary.",
            audio_file,
        ])
        return response.text.strip()
    finally:
        os.unlink(tmp_path)
