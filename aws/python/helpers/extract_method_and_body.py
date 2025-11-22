"""
Helper to extract HTTP method and body from event.
"""

# Allowed HTTP methods
allowed_methods: set = {"GET", "POST", "OPTIONS"}


def extract_method_and_body(event) -> tuple[str, dict | None]:
    """Extracts the HTTP method and body from the event.
        Also handles query parameters for GET requests.
    
    Args:
        event (dict): The event data.

    Returns:
        tuple: (method, body)
    """
    method: str = event.get("httpMethod") or event.get("requestContext", {}).get(
        "http", {}
    ).get("method", "")
    if not method:
        return "", "no_method", None
    method = method.upper()
    if method not in allowed_methods:
        return method, "method_not_allowed", f"Method {method} not allowed."
    if method == "OPTIONS":
        return method, "ok", None
    if method == "GET":
        query_params = event.get("queryStringParameters") or {}
        # Extract primary key, limit, and ExclusiveStartKey from query parameters
        limit = query_params.get("limit", 10)
        exclusive_start_key_str = query_params.get("ExclusiveStartKey")
        addl_info = {
            "limit": limit,
            "ExclusiveStartKey": exclusive_start_key_str,
        }
        return method, "ok", addl_info
    return method, "ok", event.get("body", {})
