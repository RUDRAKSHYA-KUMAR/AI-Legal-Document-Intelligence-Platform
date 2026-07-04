from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


# ==========================
# Request Model
# ==========================

class ChatRequest(BaseModel):
    document_id: int
    question: str


# ==========================
# Response Model (Optional)
# ==========================

class ChatResponse(BaseModel):
    success: bool
    message: str
    data: dict


# ==========================
# Chat Endpoint
# ==========================

@router.post(
    "/",
    response_model=ChatResponse
)
async def chat_with_document(request: ChatRequest):
    """
    Chat with an uploaded legal document.

    Parameters:
        document_id : int
        question : str

    Returns:
        AI generated answer.
    """

    try:

        # -----------------------------------------
        # TODO:
        # Replace this with RAG Team function
        #
        # answer = chat_with_document(
        #     request.document_id,
        #     request.question
        # )
        # -----------------------------------------

        dummy_answer = (
            f"You asked: '{request.question}'. "
            "RAG pipeline is not connected yet."
        )

        return ChatResponse(
            success=True,
            message="Chat response generated successfully.",
            data={
                "document_id": request.document_id,
                "question": request.question,
                "answer": dummy_answer
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )