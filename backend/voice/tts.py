import os
import wave
import logging
from piper.voice import PiperVoice

logger = logging.getLogger(__name__)

# Default Piper model path. In a real setup, these models need to be downloaded locally.
# E.g., https://huggingface.co/rhasspy/piper-voices
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "models", "en_US-lessac-medium.onnx")

class TTSEngine:
    def __init__(self):
        self.voice = None
        if os.path.exists(MODEL_PATH):
            try:
                self.voice = PiperVoice.load(MODEL_PATH)
                logger.info("Piper TTS model loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load Piper model: {e}")
        else:
            logger.warning(f"Piper model not found at {MODEL_PATH}. TTS will be disabled until downloaded.")

    def synthesize_to_file(self, text: str, output_path: str = "output.wav") -> str:
        """Synthesizes text to a WAV file and returns the path."""
        if not self.voice:
            logger.error("TTS Engine is not initialized with a valid model.")
            return ""

        try:
            with wave.open(output_path, "wb") as wav_file:
                self.voice.synthesize(text, wav_file)
            return output_path
        except Exception as e:
            logger.error(f"Error synthesizing speech: {e}")
            return ""

tts_engine = TTSEngine()
