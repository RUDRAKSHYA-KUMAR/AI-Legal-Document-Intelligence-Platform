from fastapi import FastAPI

from app.api.upload import router as upload_router
from app.api.summary import router as summary_router
from app.api.contract import router as contract_router
from app.api.clause import router as clause_router
from app.api.chat import router as chat_router
from app.api.dashboard import router as dashboard_router

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


# ======================================================
# Register Routers
# ======================================================

app.include_router(upload_router)
app.include_router(summary_router)
app.include_router(contract_router)
app.include_router(clause_router)
app.include_router(chat_router)
app.include_router(dashboard_router)


# ======================================================
# Home
# ======================================================

@app.get("/")
def home():

    return {
        "message": "Backend is running successfully!"
    }