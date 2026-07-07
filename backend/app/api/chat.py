from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.utils.helpers import parse_json_response
from app.database.db import get_db
from app.database.models import Document
from app.rag.chain import LegalRAGChain


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


# ======================================================
# Request Model
# ======================================================

class ChatRequest(BaseModel):
    document_id: int
    question: str


# ======================================================
# Response Model
# ======================================================

class ChatResponse(BaseModel):
    success: bool
    message: str
    data: dict


# ======================================================
# Chat Endpoint
# ======================================================

@router.post(
    "/",
    response_model=ChatResponse
)
async def chat_with_document(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Chat with an uploaded legal document.
    """

    try:

        # -------------------------------------------------
        # Validate Question
        # -------------------------------------------------

        if not request.question.strip():
            raise HTTPException(
                status_code=400,
                detail="Question cannot be empty."
            )

        # -------------------------------------------------
        # Check Document Exists
        # -------------------------------------------------

        document = db.query(Document).filter(
            Document.id == request.document_id
        ).first()

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found."
            )

        # -------------------------------------------------
        # Create RAG Chain
        # -------------------------------------------------

        rag = LegalRAGChain(
            document_id=request.document_id
        )

        # -------------------------------------------------
        # Generate Answer
        # -------------------------------------------------

        answer = rag.ask(
            request.question
        )
        result = parse_json_response(answer)

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return ChatResponse(
            success=True,
            message="Chat response generated successfully.",
            data={
                "document_id": request.document_id,
                "question": request.question,
                "answer": result["answer"]
            }
        )

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )