from langchain_google_genai import ChatGoogleGenerativeAI

from .config import CHAT_MODEL, GEMINI_API_KEY


llm = ChatGoogleGenerativeAI(
    model=CHAT_MODEL,
    google_api_key=GEMINI_API_KEY,
    temperature=0,
)


def get_gemini_response(prompt: str) -> str:
    """
    Generate a response from Gemini.
    """

    try:
        response = llm.invoke(prompt)
        return response.content

    except Exception as e:
        raise RuntimeError(f"Gemini Error: {str(e)}")