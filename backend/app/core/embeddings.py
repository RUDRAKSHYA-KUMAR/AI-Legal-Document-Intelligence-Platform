from langchain_google_genai import GoogleGenerativeAIEmbeddings

from .config import GEMINI_API_KEY, EMBEDDING_MODEL


class EmbeddingService:
    def __init__(self):
        self.embedding_model = GoogleGenerativeAIEmbeddings(
            model=EMBEDDING_MODEL,
            google_api_key=GEMINI_API_KEY
        )

    def embed_documents(self, texts):
        return self.embedding_model.embed_documents(texts)

    def embed_query(self, query):
        return self.embedding_model.embed_query(query)


embedding_service = EmbeddingService()