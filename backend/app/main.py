from fastapi import FastAPI
from app.api.upload import router as upload_router
from app.api.chat import router as chat_router
from app.api.analysis import router as analysis_router
from app.api.dashboard import router as dashboard_router
from app.database.db import engine
from app.database.models import Base

# Create all tables in the database


app = FastAPI(
    title="AI Legal & Document Intelligence Platform"
    )


Base.metadata.create_all(bind=engine)


app.include_router(dashboard_router)
app.include_router(chat_router)
app.include_router(upload_router)
app.include_router(analysis_router)
app.include_router(dashboard_router)


@app.get("/")
def home():
    return {
        "message": "Backend is running successfully!"
    }