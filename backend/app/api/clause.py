from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.utils.helpers import (
    parse_json_response
)

from app.database.db import get_db
from app.database.models import Document

from app.utils.pdf_reader import extract_document

from app.core.gemini import get_gemini_response

from app.core.prompts import (
    CLAUSE_EXTRACTION_PROMPT,
    build_prompt,
)


router = APIRouter(
    prefix="/clause",
    tags=["Clause Extraction"]
)


# ======================================================
# Request Model
# ======================================================

class ClauseRequest(BaseModel):
    document_id: int


# ======================================================
# Response Model
# ======================================================

class ClauseResponse(BaseModel):
    success: bool
    message: str
    data: dict


# ======================================================
# Helper
# ======================================================

def get_document_text(
    document_id: int,
    db: Session
) -> str:
    """
    Fetch document from database
    and extract text.
    """

    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    extracted = extract_document(
        document.filepath
    )

    return extracted["text"]


# ======================================================
# Generate Summary
# ======================================================

@router.post(
    "/",
    response_model=ClauseResponse
)
async def analyze_clause(
    request: ClauseRequest,
    db: Session = Depends(get_db)
):

    try:

        # --------------------------------------------
        # Read document
        # --------------------------------------------

        document_text = get_document_text(
            request.document_id,
            db
        )

        # --------------------------------------------
        # Build Prompt
        # --------------------------------------------

        prompt = build_prompt(
            CLAUSE_EXTRACTION_PROMPT,
            document=document_text
        )

        # --------------------------------------------
        # Gemini
        # --------------------------------------------

        response = get_gemini_response(
            prompt
        )

        # --------------------------------------------
        # Parse JSON
        # --------------------------------------------

        

        result = parse_json_response(response)



        # --------------------------------------------
        # Success
        # --------------------------------------------

        return ClauseResponse(
            success=True,
            message="Clause extracted successfully.",
            data=result
        )

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )