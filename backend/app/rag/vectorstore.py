"""
vectorstore.py

Manages ChromaDB vector database for legal document retrieval.
"""

from pathlib import Path
from typing import List

from langchain_core.documents import Document
from langchain_chroma import Chroma

from app.core.embeddings import embedding_service


# ======================================================
# Configuration
# ======================================================

VECTOR_DB_PATH = Path("app/vectors")

VECTOR_DB_PATH.mkdir(
    parents=True,
    exist_ok=True
)


# ======================================================
# Vector Store Manager
# ======================================================

class VectorStoreManager:
    """
    Handles ChromaDB operations.
    """

    def __init__(
        self,
        persist_directory: str = str(VECTOR_DB_PATH)
    ):

        self.persist_directory = persist_directory

    # --------------------------------------------------
    # Collection Name
    # --------------------------------------------------

    @staticmethod
    def get_collection_name(
        document_id: int
    ) -> str:

        return f"document_{document_id}"

    # --------------------------------------------------
    # Create Vector Store
    # --------------------------------------------------

    def create_vectorstore(
        self,
        documents: List[Document],
        document_id: int
    ) -> Chroma:

        if not documents:
            raise ValueError(
                "No document chunks provided."
            )

        collection_name = self.get_collection_name(
            document_id
        )

        try:

            vectorstore = Chroma.from_documents(
                documents=documents,
                embedding=embedding_service.embedding_model,
                collection_name=collection_name,
                persist_directory=self.persist_directory
            )

            return vectorstore

        except Exception as e:

            raise RuntimeError(
                f"Failed to create vector store: {e}"
            )

    # --------------------------------------------------
    # Load Existing Collection
    # --------------------------------------------------

    def load_vectorstore(
        self,
        document_id: int
    ) -> Chroma:

        collection_name = self.get_collection_name(
            document_id
        )

        try:

            return Chroma(
                collection_name=collection_name,
                embedding_function=embedding_service.embedding_model,
                persist_directory=self.persist_directory
            )

        except Exception as e:

            raise RuntimeError(
                f"Unable to load vector store: {e}"
            )

    # --------------------------------------------------
    # Get Retriever
    # --------------------------------------------------

    def get_retriever(
        self,
        document_id: int,
        k: int = 6,
        search_type: str = "similarity"
    ):

        vectorstore = self.load_vectorstore(
            document_id
        )

        return vectorstore.as_retriever(
            search_type=search_type,
            search_kwargs={
                "k": k
            }
        )

    # --------------------------------------------------
    # Delete Collection
    # --------------------------------------------------

    def delete_vectorstore(
        self,
        document_id: int
    ):

        vectorstore = self.load_vectorstore(
            document_id
        )

        try:

            vectorstore.delete_collection()

        except Exception as e:

            raise RuntimeError(
                f"Unable to delete collection: {e}"
            )


# ======================================================
# Singleton
# ======================================================

vector_manager = VectorStoreManager()