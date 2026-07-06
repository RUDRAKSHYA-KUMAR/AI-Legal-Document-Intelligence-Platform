from langchain_google_genai import ChatGoogleGenerativeAI

from .config import GEMINI_API_KEY, CHAT_MODEL

llm = ChatGoogleGenerativeAI(
    model=CHAT_MODEL,
    google_api_key=GEMINI_API_KEY,
    temperature=0
)