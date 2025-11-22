"""
CORS headers builder helper.
"""
import os


# Allowed CORS origins
if os.getenv("ENV") == "production":
    cors_allowed_origins: list[str] = [
        "https://magazine.chandamarutham.org",
    ]
else:
    cors_allowed_origins: list[str] = [
        "http://localhost:5173",  # For vite dev env - should be removed in production
        "https://magazine.chandamarutham.org",
    ]


def build_cors_headers(event) -> dict:
    """Build CORS headers based on the request origin.

    Args:
        event (dict): The event data.

    Returns:
        dict: The CORS headers.
    """
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    }

    origin = event.get("headers", {}).get("origin") or event.get("headers", {}).get(
        "Origin"
    )

    if origin in cors_allowed_origins:
        headers["Access-Control-Allow-Origin"] = origin

    return headers
