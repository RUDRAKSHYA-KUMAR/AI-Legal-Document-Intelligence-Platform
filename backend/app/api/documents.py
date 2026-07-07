from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os

from app.database.db import get_db
from app.database.models import Document


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


# =====================================================
# Response Model
# =====================================================

class DocumentResponse(BaseModel):
    success: bool
    message: str
    data: object


# =====================================================
# Get All Documents
# =====================================================

@router.get(
    "/",
    response_model=DocumentResponse
)
async def get_all_documents(
    db: Session = Depends(get_db)
):

    documents = db.query(Document).all()

    data = []

    for doc in documents:

        data.append({
            "id": doc.id,
            "filename": doc.filename,
            "filepath": doc.filepath,
            "file_size": doc.file_size,
            "content_type": doc.content_type,
            "uploaded_at": doc.uploaded_at
        })

    return DocumentResponse(
        success=True,
        message="Documents fetched successfully.",
        data=data
    )


# =====================================================
# Get Single Document
# =====================================================

@router.get(
    "/{document_id}",
    response_model=DocumentResponse
)
async def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return DocumentResponse(
        success=True,
        message="Document found.",
        data={
            "id": document.id,
            "filename": document.filename,
            "filepath": document.filepath,
            "file_size": document.file_size,
            "content_type": document.content_type,
            "uploaded_at": document.uploaded_at
        }
    )


# =====================================================
# Delete Document
# =====================================================

@router.delete(
    "/{document_id}",
    response_model=DocumentResponse
)
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    # ------------------------------------------
    # Delete PDF from uploads folder
    # ------------------------------------------

    if os.path.exists(document.filepath):
        os.remove(document.filepath)

    # ------------------------------------------
    # TODO
    # Delete vectors from ChromaDB
    # rag.delete_document(document_id)
    # ------------------------------------------

    deleted_document = {
        "id": document.id,
        "filename": document.filename
    }

    db.delete(document)
    db.commit()

    return DocumentResponse(
        success=True,
        message="Document deleted successfully.",
        data=deleted_document
    )


# =====================================================
# Download Document
# =====================================================

@router.get(
    "/{document_id}/download"
)
async def download_document(
    document_id: int,
    db: Session = Depends(get_db)
):

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    if not os.path.exists(document.filepath):

        raise HTTPException(
            status_code=404,
            detail="Document file does not exist."
        )

    return FileResponse(
        path=document.filepath,
        filename=document.filename,
        media_type=document.content_type
    )