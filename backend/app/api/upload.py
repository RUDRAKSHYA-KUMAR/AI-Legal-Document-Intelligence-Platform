from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.rag.loader import document_loader
from app.rag.splitter import document_splitter
from app.rag.vectorstore import vector_manager
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
            print("=" * 50)
            print("Saving PDF to:")
            print(os.path.abspath(file_path))
            print("=" * 50)

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
        try:
        
            documents = document_loader.load_document(
                document.filepath
            )
        
            chunks = document_splitter.split_documents(
                documents
            )
        
            for index, chunk in enumerate(chunks):
        
                chunk.metadata["document_id"] = document.id
                chunk.metadata["filename"] = document.filename
                chunk.metadata["chunk_id"] = index
        
            vector_manager.create_vectorstore(
                documents=chunks,
                document_id=document.id
            )
        
        except Exception:
        
            db.delete(document)
        
            db.commit()
        
            if os.path.exists(document.filepath):
                os.remove(document.filepath)
        
            raise        

        # ==================================================
        # Index Document into ChromaDB
        # ==================================================
        
        # Step 1: Load PDF
        documents = document_loader.load_document(
            document.filepath
        )
        
        # Step 2: Split into chunks
        chunks = document_splitter.split_documents(
            documents
        )
        
        # Step 3: Attach metadata
        for index, chunk in enumerate(chunks):
        
            chunk.metadata["document_id"] = document.id
            chunk.metadata["filename"] = document.filename
            chunk.metadata["chunk_id"] = index
        
        # Step 4: Store in ChromaDB
        vector_manager.create_vectorstore(
            documents=chunks,
            document_id=document.id
        )
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