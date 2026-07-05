"""
PDF and DOCX reading utilities.
"""
from pathlib import Path
import fitz  # PyMuPDF
import docx as python_docx
def extract_text_from_pdf(path: str) -> dict:
    """
    Extract text and metadata from a PDF file.
    Returns:
        dict: {text, pages, metadata}
    """
    doc = fitz.open(path)
    pages = []
    for i in range(len(doc)):
        page = doc[i]
        text = page.get_text("text").strip()
        pages.append({
            "page_number": i + 1,
            "text": text,
            "char_count": len(text),
        })
    full_text = "\n\n".join(
        f"[Page {p['page_number']}]\n{p['text']}"
        for p in pages if p["text"]
    )
    meta = doc.metadata or {}
    doc.close()
    return {
        "text": full_text,
        "pages": pages,
        "page_count": len(pages),
        "metadata": {
            "title": meta.get("title", ""),
            "author": meta.get("author", ""),
            "creator": meta.get("creator", ""),
            "subject": meta.get("subject", ""),
        },
    }
def extract_text_from_docx(path: str) -> dict:
    """
    Extract text and metadata from a DOCX file.
    Returns:
        dict: {text, pages (estimated), metadata}
    """
    document = python_docx.Document(path)
    # Extract paragraphs
    paragraphs = []
    for para in document.paragraphs:
        if para.text.strip():
            paragraphs.append(para.text.strip())
    # Extract tables
    table_texts = []
    for table in document.tables:
        for row in table.rows:
            row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
            if row_text:
                table_texts.append(row_text)
    all_text_parts = paragraphs + (["[Tables]"] + table_texts if table_texts else [])
    full_text = "\n\n".join(all_text_parts)
    word_count = len(full_text.split())
    # Core properties
    props = document.core_properties
    return {
        "text": full_text,
        "pages": [],
        "page_count": max(1, word_count // 500),
        "metadata": {
            "title": props.title or "",
            "author": props.author or "",
            "created": str(props.created) if props.created else "",
            "subject": props.subject or "",
        },
    }
def get_text_preview(text: str, max_chars: int = 500) -> str:
    """Return a short preview of document text."""
    cleaned = " ".join(text.split())
    return cleaned[:max_chars] + ("..." if len(cleaned) > max_chars else "")
