"""
vectorstore.py

Creates, saves, loads, and manages the FAISS vector database
for legal document retrieval.
"""

from pathlib import Path
from typing import List

from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS

from app.core.embeddings import embedding_service 


# Default directory to save vector database
VECTOR_DB_PATH = Path("app/vectors")


class VectorStoreManager:
    """
    Handles FAISS vector database operations.
    """

    def __init__(self, vector_path: Path = VECTOR_DB_PATH):
        self.vector_path = vector_path
        self.vector_path.mkdir(parents=True, exist_ok=True)

    def create_vectorstore(self, documents: List[Document]) -> FAISS:
        """
        Create a FAISS vector database from document chunks.

        Args:
            documents: List of LangChain Document objects

        Returns:
            FAISS object
        """

        if not documents:
            raise ValueError("No documents provided.")

        vectorstore = FAISS.from_documents(
            documents,
            embedding_service.embedding_model
        )

        return vectorstore

    def save_vectorstore(
        self,
        vectorstore: FAISS,
        index_name: str = "legal_index"
    ) -> None:
        """
        Save FAISS vector database to disk.
        """

        save_path = self.vector_path / index_name

        vectorstore.save_local(str(save_path))

    def load_vectorstore(
        self,
        index_name: str = "legal_index"
    ) -> FAISS:
        """
        Load saved FAISS vector database.
        """

        load_path = self.vector_path / index_name

        if not load_path.exists():
            raise FileNotFoundError(
                f"Vector database '{index_name}' not found."
            )

        vectorstore = FAISS.load_local(
            folder_path=str(load_path),
            embeddings=embedding_service.embedding_model,
            allow_dangerous_deserialization=True
        )

        return vectorstore

    def create_and_save(
        self,
        documents: List[Document],
        index_name: str = "legal_index"
    ) -> FAISS:
        """
        Create and save vector database in one step.
        """

        vectorstore = self.create_vectorstore(documents)

        self.save_vectorstore(
            vectorstore,
            index_name=index_name
        )

        return vectorstore

    def get_retriever(
        self,
        index_name: str = "legal_index",
        search_type: str = "similarity",
        k: int = 4,
    ):
        """
        Load vector database and return retriever.
        """

        vectorstore = self.load_vectorstore(index_name)

        retriever = vectorstore.as_retriever(
            search_type=search_type,
            search_kwargs={"k": k},
        )

        return retriever


# Singleton instance
vector_manager = VectorStoreManager()