"""
loader.py

Responsible for loading supported legal documents into LangChain
Document objects.

Supported Formats:
- PDF
- DOCX
- TXT
"""

from pathlib import Path
from typing import List

from langchain_core.documents import Document
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    Docx2txtLoader,
)


SUPPORTED_EXTENSIONS = {
    ".pdf": PyPDFLoader,
    ".txt": TextLoader,
    ".docx": Docx2txtLoader,
}


class DocumentLoader:
    """
    Loads legal documents into LangChain Document objects.
    """

    def __init__(self):
        pass

    def load_document(self, file_path: str) -> List[Document]:
        """
        Load a single document.

        Args:
            file_path (str): Path to uploaded file.

        Returns:
            List[Document]
        """

        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        extension = path.suffix.lower()

        if extension not in SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported file type: {extension}"
            )

        loader_class = SUPPORTED_EXTENSIONS[extension]

        loader = loader_class(str(path))

        documents = loader.load()

        return documents

    def load_multiple_documents(
        self,
        folder_path: str
    ) -> List[Document]:
        """
        Load all supported documents from a folder.

        Args:
            folder_path (str)

        Returns:
            List[Document]
        """

        folder = Path(folder_path)

        if not folder.exists():
            raise FileNotFoundError(
                f"Folder not found: {folder_path}"
            )

        all_documents = []

        for file in folder.iterdir():

            if file.suffix.lower() in SUPPORTED_EXTENSIONS:

                docs = self.load_document(str(file))

                all_documents.extend(docs)

        return all_documents


# Singleton Instance

document_loader = DocumentLoader()