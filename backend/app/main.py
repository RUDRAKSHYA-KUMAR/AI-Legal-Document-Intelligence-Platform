from fastapi import FastAPI

from app.api.upload import router as upload_router
from app.api.summary import router as summary_router
from app.api.contract import router as contract_router
from app.api.clause import router as clause_router
from app.api.chat import router as chat_router
from app.api.documents import router as documents_router
from fastapi.middleware.cors import CORSMiddleware


from app.database.db import engine
from app.database.models import Base


# ======================================================
# Create Database Tables
# ======================================================

Base.metadata.create_all(bind=engine)


# ======================================================
# FastAPI App
# ======================================================

app = FastAPI(
    title="AI Legal & Document Intelligence Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",

        # Production Frontend
        "https://ai-legal-document-intelligence-plat.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================================
# Register Routers
# ======================================================

app.include_router(upload_router)
app.include_router(summary_router)
app.include_router(contract_router)
app.include_router(clause_router)
app.include_router(chat_router)
app.include_router(documents_router)


# ======================================================
# Home
# ======================================================

@app.get("/")
def home():

    return {
        "message": "AI Legal & Document Intelligence Platform is running successfully."
    }