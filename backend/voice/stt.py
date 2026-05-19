import os
import logging
from faster_whisper import WhisperModel

logger = logging.getLogger(__name__)

# Use a small or base model for low latency local execution.
# Models are downloaded to a local cache automatically.
MODEL_SIZE = "base.en"

class STTEngine:
    def __init__(self):
        try:
            # CPU or CUDA depending on system capabilities
            # For general compatibility initially using cpu, int8
            self.model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
            logger.info(f"Loaded faster-whisper model: {MODEL_SIZE}")
        except Exception as e:
            logger.error(f"Failed to load Whisper model: {e}")
            self.model = None

    def transcribe_audio_file(self, file_path: str) -> str:
        """Transcribes an audio file and returns the text."""
        if not self.model:
            return ""
        
        try:
            segments, info = self.model.transcribe(file_path, beam_size=5)
            text = "".join([segment.text for segment in segments])
            return text.strip()
        except Exception as e:
            logger.error(f"Error transcribing audio: {e}")
            return ""

stt_engine = STTEngine()
