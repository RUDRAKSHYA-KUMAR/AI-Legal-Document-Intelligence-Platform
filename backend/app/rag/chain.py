"""
chain.py
Creates the complete Retrieval-Augmented Generation (RAG)
pipeline for answering legal document queries.
"""

from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from app.rag.retrieval import DocumentRetriever
from app.core.gemini import llm
from app.core.prompts import (
    CHAT_PROMPT,
    LEGAL_SYSTEM_PROMPT,
    JSON_RULE,
)


class LegalRAGChain:

    def __init__(
        self,
        document_id: int,
    ):
        self.document_id = document_id
        self.llm = llm
        self.prompt = CHAT_PROMPT.partial(
            system_prompt=LEGAL_SYSTEM_PROMPT,
            json_rule=JSON_RULE,
        )
        self.parser = StrOutputParser()

    @staticmethod
    def format_docs(documents):
        """
        Convert retrieved documents into a single context string.
        """

        return "\n\n".join(
            doc.page_content
            for doc in documents
        )

    def build_chain(self):
        """
        Build LangChain RAG pipeline.
        """
        retriever = DocumentRetriever(
            document_id=self.document_id
        )
        
        chain = (
            {
                "context":
                    retriever.retriever
                    | self.format_docs,
        
                "question": RunnablePassthrough(),
            }
            | self.prompt
            | self.llm
            | self.parser
        )
        
        return chain

    def ask(
        self,
        question: str,
    ) -> str:
        """
        Ask a legal question.

        Args:
            question: User question

        Returns:
            AI Answer
        """

        chain = self.build_chain()

        response = chain.invoke(question)

        return response


# Singleton Instance

