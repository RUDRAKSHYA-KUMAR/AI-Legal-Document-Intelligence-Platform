from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


# ======================================================
# Request Models
# ======================================================

class ContractRequest(BaseModel):
    document_id: int


class ClauseRequest(BaseModel):
    document_id: int
    clause: str


class SummaryRequest(BaseModel):
    document_id: int


# ======================================================
# Response Model
# ======================================================

class AnalysisResponse(BaseModel):
    success: bool
    message: str
    data: dict


# ======================================================
# Contract Analysis
# ======================================================

@router.post(
    "/contract",
    response_model=AnalysisResponse
)
async def analyze_contract(request: ContractRequest):

    try:

        # TODO:
        # result = core.analyze_contract(request.document_id)

        result = {
            "risk_level": "Medium",
            "contract_type": "Employment Agreement",
            "parties": [
                "ABC Pvt Ltd",
                "John Doe"
            ],
            "duration": "2 Years",
            "status": "Dummy Response"
        }

        return AnalysisResponse(
            success=True,
            message="Contract analysis completed successfully.",
            data=result
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ======================================================
# Clause Explanation
# ======================================================

@router.post(
    "/clause",
    response_model=AnalysisResponse
)
async def explain_clause(request: ClauseRequest):

    try:

        # TODO:
        # explanation = core.explain_clause(
        #     request.document_id,
        #     request.clause
        # )

        explanation = {
            "clause": request.clause,
            "explanation":
                "This is a dummy explanation. "
                "Core AI is not connected yet."
        }

        return AnalysisResponse(
            success=True,
            message="Clause explanation generated successfully.",
            data=explanation
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ======================================================
# Document Summary
# ======================================================

@router.post(
    "/summary",
    response_model=AnalysisResponse
)
async def summarize_document(request: SummaryRequest):

    try:

        # TODO:
        # summary = core.generate_summary(request.document_id)

        summary = {
            "summary":
                "This is a dummy summary generated for testing purposes."
        }

        return AnalysisResponse(
            success=True,
            message="Summary generated successfully.",
            data=summary
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )