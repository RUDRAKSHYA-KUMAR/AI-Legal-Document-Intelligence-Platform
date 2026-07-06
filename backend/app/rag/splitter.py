"""
splitter.py

Splits loaded documents into smaller chunks for efficient
embedding generation and retrieval.
"""

from typing import List

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


class DocumentSplitter:
    """
    Handles splitting of documents into smaller chunks.
    """

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ]
        )

    def split_documents(
        self,
        documents: List[Document]
    ) -> List[Document]:
        """
        Split documents into chunks.

        Args:
            documents: List of LangChain Document objects.

        Returns:
            List of chunked Document objects.
        """

        if not documents:
            raise ValueError("No documents provided for splitting.")

        chunks = self.text_splitter.split_documents(documents)

        return chunks

    def split_single_document(
        self,
        document: Document
    ) -> List[Document]:
        """
        Split a single document.

        Args:
            document: LangChain Document

        Returns:
            List of chunks
        """

        return self.text_splitter.split_documents([document])

    @staticmethod
    def chunk_statistics(chunks: List[Document]) -> dict:
        """
        Returns statistics of generated chunks.
        """

        return {
            "total_chunks": len(chunks),
            "average_chunk_length": (
                sum(len(chunk.page_content) for chunk in chunks)
                / len(chunks)
                if chunks
                else 0
            ),
        }


# Singleton Instance

document_splitter = DocumentSplitter()