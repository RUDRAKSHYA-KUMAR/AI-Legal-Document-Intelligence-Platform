from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import Document

import os
import uuid
import shutil

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

# ======================================================
# Configuration
# ======================================================

UPLOAD_FOLDER = "app/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# ======================================================
# Response Model
# ======================================================

class UploadResponse(BaseModel):
    success: bool
    message: str
    data: dict


# ======================================================
# Upload Endpoint
# ======================================================

@router.post(
    "/",
    response_model=UploadResponse
)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a legal document.

    Current Workflow

    User
        ↓
    Upload PDF
        ↓
    Validate
        ↓
    Save PDF
        ↓
    Save Metadata in SQLite
        ↓
    Return document_id

    Future Workflow

    Upload
        ↓
    PDF Reader
        ↓
    Chunking
        ↓
    Embeddings
        ↓
    ChromaDB
        ↓
    Gemini Analysis
    """

    try:

        # ==================================================
        # Validate Extension
        # ==================================================

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed."
            )

        # ==================================================
        # Validate Content Type
        # ==================================================

        if file.content_type != "application/pdf":
            raise HTTPException(
                status_code=400,
                detail="Invalid PDF file."
            )

        # ==================================================
        # Generate Unique Filename
        # ==================================================

        unique_filename = f"{uuid.uuid4()}.pdf"

        file_path = os.path.join(
            UPLOAD_FOLDER,
            unique_filename
        )

        # ==================================================
        # Save File
        # ==================================================

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ==================================================
        # Validate File Size
        # ==================================================

        file_size = os.path.getsize(file_path)

        if file_size > MAX_FILE_SIZE:

            os.remove(file_path)

            raise HTTPException(
                status_code=400,
                detail="File size exceeds 10 MB."
            )

        # ==================================================
        # Save Metadata to SQLite
        # ==================================================

        document = Document(
            filename=file.filename,
            filepath=file_path,
            file_size=file_size,
            content_type=file.content_type
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        # ==================================================
        # Future
        # ==================================================

        # TODO:
        #
        # pdf_reader.extract_text(document.filepath)
        #
        # rag.index_document(document.filepath)
        #
        # embeddings.generate(...)
        #

        # ==================================================
        # Success Response
        # ==================================================

        return UploadResponse(
            success=True,
            message="Document uploaded successfully.",
            data={
                "document_id": document.id,
                "filename": document.filename,
                "filepath": document.filepath,
                "file_size": document.file_size,
                "content_type": document.content_type
            }
        )

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )