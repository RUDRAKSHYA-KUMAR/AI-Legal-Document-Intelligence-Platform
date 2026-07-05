import google.generativeai as genai

from app.core.config import GEMINI_API_KEY, CHAT_MODEL


genai.configure(api_key=GEMINI_API_KEY)


model = genai.GenerativeModel(CHAT_MODEL)


def get_gemini_response(prompt: str) -> str:
    """
    Generate response from Gemini model.
    """

    response = model.generate_content(prompt)

    return response.text