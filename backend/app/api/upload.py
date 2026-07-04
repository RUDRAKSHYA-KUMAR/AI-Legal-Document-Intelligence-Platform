from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import os
import shutil

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

# ==========================
# Configuration
# ==========================

UPLOAD_FOLDER = "app/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ==========================
# Response Model
# ==========================

class UploadResponse(BaseModel):
    success: bool
    message: str
    data: dict


# ==========================
# Upload Endpoint
# ==========================

@router.post(
    "/",
    response_model=UploadResponse
)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a legal document.

    Supported formats:
    - PDF

    Future Workflow:
        Save PDF
            ↓
        Extract Text
            ↓
        Chunking
            ↓
        Embeddings
            ↓
        Store in ChromaDB
            ↓
        Save Metadata
    """

    try:

        # -----------------------------
        # Validate File
        # -----------------------------
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed."
            )

        # -----------------------------
        # Save File
        # -----------------------------
        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ------------------------------------------------
        # TODO:
        # Replace with RAG Team function
        #
        # document_id = index_document(file_path)
        #
        # OR
        #
        # rag.index_document(file_path)
        # ------------------------------------------------

        dummy_document_id = 1

        return UploadResponse(
            success=True,
            message="Document uploaded successfully.",
            data={
                "document_id": dummy_document_id,
                "filename": file.filename,
                "file_path": file_path
            }
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )