from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from pydantic import BaseModel
import httpx
import logging

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = "http://localhost:11434"

class LLMService:
    def __init__(self):
        self.base_url = OLLAMA_BASE_URL
        
    def get_llm(self, model_name: str, temperature: float = 0.7):
        """
        Available primary models:
        - deepseek-r1:8b (General Reasoning / Teaching)
        - deepseek-coder-v2 (Coding Agent)
        - llava (Vision Agent)
        """
        return Ollama(
            model=model_name,
            base_url=self.base_url,
            temperature=temperature
        )

    def get_embeddings(self, model_name: str = "nomic-embed-text"):
        """Embeddings model for ChromaDB and memory retrieval."""
        return OllamaEmbeddings(
            model=model_name,
            base_url=self.base_url
        )

    async def generate_response(self, prompt: str, model: str = "deepseek-r1:8b") -> str:
        llm = self.get_llm(model_name=model)
        try:
            response = llm.invoke(prompt)
            return response
        except Exception as e:
            logger.error(f"Error communicating with Ollama: {e}")
            return "Error: Could not connect to local LLM."

llm_service = LLMService()
