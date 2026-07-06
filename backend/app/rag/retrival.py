"""
retrieval.py

Handles retrieval of relevant document chunks from the FAISS
vector database.
"""

from typing import List

from langchain_core.documents import Document

from rag.vectorstore import vector_manager


class DocumentRetriever:
    """
    Retrieves the most relevant document chunks
    from the vector database.
    """

    def __init__(
        self,
        index_name: str = "legal_index",
        k: int = 4,
        search_type: str = "similarity",
    ):
        self.index_name = index_name
        self.k = k
        self.search_type = search_type
        self._retriever = None

    @property
    def retriever(self):
        if self._retriever is None:
            self._retriever = vector_manager.get_retriever(
                index_name=self.index_name,
                k=self.k,
                search_type=self.search_type,
            )
        return self._retriever

    @retriever.setter
    def retriever(self, value):
        self._retriever = value

    def retrieve(
        self,
        query: str,
    ) -> List[Document]:
        """
        Retrieve relevant documents.

        Args:
            query (str): User query

        Returns:
            List[Document]
        """

        if not query.strip():
            raise ValueError("Query cannot be empty.")

        documents = self.retriever.invoke(query)

        return documents

    def retrieve_context(
        self,
        query: str,
    ) -> str:
        """
        Retrieve documents and combine into a single context string.

        Args:
            query (str)

        Returns:
            str
        """

        docs = self.retrieve(query)

        context = "\n\n".join(
            doc.page_content
            for doc in docs
        )

        return context

    def retrieve_with_metadata(
        self,
        query: str,
    ) -> List[dict]:
        """
        Retrieve documents with metadata.

        Returns:
            List[dict]
        """

        docs = self.retrieve(query)

        results = []

        for doc in docs:
            results.append(
                {
                    "content": doc.page_content,
                    "metadata": doc.metadata,
                }
            )

        return results


# Singleton Instance

document_retriever = DocumentRetriever()