from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(
    prefix="/documents",
    tags=["Dashboard"]
)

# =====================================================
# Dummy Database (Temporary)
# Replace with SQLite later
# =====================================================

documents = [
    {
        "id": 1,
        "filename": "Employment_Contract.pdf",
        "status": "Indexed",
        "upload_date": "2026-07-04"
    },
    {
        "id": 2,
        "filename": "Rental_Agreement.pdf",
        "status": "Indexed",
        "upload_date": "2026-07-04"
    }
]


# =====================================================
# Response Model
# =====================================================

class DashboardResponse(BaseModel):
    success: bool
    message: str
    data: object


# =====================================================
# Get All Documents
# =====================================================

@router.get(
    "/",
    response_model=DashboardResponse
)
async def get_all_documents():

    return DashboardResponse(
        success=True,
        message="Documents fetched successfully.",
        data=documents
    )


# =====================================================
# Get Single Document
# =====================================================

@router.get(
    "/{document_id}",
    response_model=DashboardResponse
)
async def get_document(document_id: int):

    for document in documents:

        if document["id"] == document_id:

            return DashboardResponse(
                success=True,
                message="Document found.",
                data=document
            )

    raise HTTPException(
        status_code=404,
        detail="Document not found."
    )


# =====================================================
# Delete Document
# =====================================================

@router.delete(
    "/{document_id}",
    response_model=DashboardResponse
)
async def delete_document(document_id: int):

    for document in documents:

        if document["id"] == document_id:

            documents.remove(document)

            # TODO:
            # rag.delete_document(document_id)

            return DashboardResponse(
                success=True,
                message="Document deleted successfully.",
                data=document
            )

    raise HTTPException(
        status_code=404,
        detail="Document not found."
    )


# =====================================================
# Download Document
# =====================================================

@router.get(
    "/{document_id}/download",
    response_model=DashboardResponse
)
async def download_document(document_id: int):

    for document in documents:

        if document["id"] == document_id:

            # TODO:
            # Return actual PDF file

            return DashboardResponse(
                success=True,
                message="Download endpoint is working.",
                data={
                    "document_id": document_id,
                    "filename": document["filename"]
                }
            )

    raise HTTPException(
        status_code=404,
        detail="Document not found."
    )