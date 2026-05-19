import chromadb
from chromadb.config import Settings
import logging

logger = logging.getLogger(__name__)

class VectorMemory:
    def __init__(self):
        try:
            # Connect to local ChromaDB instance running via Docker Compose
            self.client = chromadb.HttpClient(host="localhost", port=8000)
            # Create or get collection for long-term memory
            self.collection = self.client.get_or_create_collection(
                name="jarvis_memory",
                metadata={"hnsw:space": "cosine"}
            )
            logger.info("Successfully connected to ChromaDB")
        except Exception as e:
            logger.error(f"Failed to connect to ChromaDB: {e}")
            self.client = None

    def add_memory(self, text_id: str, text: str, metadata: dict = None):
        if not self.client: return
        self.collection.add(
            documents=[text],
            metadatas=[metadata] if metadata else [{"source": "chat"}],
            ids=[text_id]
        )

    def query_memory(self, query: str, n_results: int = 5):
        if not self.client: return []
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return results

memory_store = VectorMemory()
