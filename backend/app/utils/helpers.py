"""
General utility helpers for the platform.
"""
import uuid
import logging

logger = logging.getLogger(__name__)
import re
from datetime import datetime
from pathlib import Path
def generate_uuid() -> str:
    """Generate a new UUID4 string."""
    return str(uuid.uuid4())
def sanitize_filename(filename: str) -> str:
    """
    Sanitize a filename to be safe for storage.
    Removes special characters and limits length.
    """
    # Keep only alphanumeric, dots, hyphens, underscores
    name = re.sub(r"[^\w\-.]", "_", filename)
    # Collapse multiple underscores
    name = re.sub(r"_+", "_", name)
    # Limit total length
    if len(name) > 200:
        ext = Path(name).suffix
        stem = Path(name).stem[:195]
        name = stem + ext
    return name
def get_file_extension(filename: str) -> str:
    """Return the lowercase file extension (without dot)."""
    return Path(filename).suffix.lower().lstrip(".")
def format_file_size(size_bytes: int) -> str:
    """Format bytes into human-readable string."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 ** 2:
        return f"{size_bytes / 1024:.1f} KB"
    elif size_bytes < 1024 ** 3:
        return f"{size_bytes / (1024 ** 2):.1f} MB"
    else:
        return f"{size_bytes / (1024 ** 3):.1f} GB"
def get_stored_filename(original_name: str) -> str:
    """
    Generate a unique stored filename that preserves the original extension.
    Format: <uuid>_<sanitized_original>
    """
    uid = generate_uuid()
    safe_name = sanitize_filename(original_name)
    return f"{uid}_{safe_name}"
def truncate_text(text: str, max_chars: int = 10000) -> str:
    """Truncate text to fit within LLM context windows."""
    if len(text) <= max_chars:
        return text
    # Try to cut at a sentence boundary
    truncated = text[:max_chars]
    last_period = truncated.rfind(".")
    if last_period > max_chars * 0.8:
        return truncated[: last_period + 1]
    return truncated + " [... truncated]"
from typing import Any
import json

def parse_json_response(text: str) -> Any:
    """
    Parse JSON returned by the LLM.

    Supports:

    - Plain JSON
    - ```json fenced blocks
    - JSON embedded inside explanations
    """

    cleaned = re.sub(
        r"```(?:json)?|```",
        "",
        text,
        flags=re.IGNORECASE
    ).strip()

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError:

        object_match = re.search(
            r"\{.*\}",
            cleaned,
            re.DOTALL
        )

        if object_match:

            return json.loads(
                object_match.group()
            )

        array_match = re.search(
            r"\[.*\]",
            cleaned,
            re.DOTALL
        )

        if array_match:

            return json.loads(
                array_match.group()
            )

        logger.exception(
            "Failed to parse Gemini JSON."
        )

        raise ValueError(
            "Gemini returned invalid JSON."
        )
def utcnow_iso() -> str:
    """Return current UTC time as ISO 8601 string."""
    return datetime.utcnow().isoformat() + "Z"
