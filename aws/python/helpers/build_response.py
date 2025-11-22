"""
AWS Python SDK Response Builder
=============================
"""
import json

# Standardized responses
responses: dict = {
    "ok": {
        "statusCode": 200,
        "message": "OK: Request successful.",
    },
    "created": {
        "statusCode": 201,
        "message": "Created: Record successfully created.",
    },
    "no_method": {
        "statusCode": 400,
        "message": "Bad Request: No HTTP method.",
    },
    "invalid_json": {
        "statusCode": 400,
        "message": "Bad Request: Invalid JSON payload.",
    },
    "missing_fields": {
        "statusCode": 400,
        "message": "Bad Request: Missing required fields.",
    },
    "no_valid_fields": {
        "statusCode": 400,
        "message": "Bad Request: No valid fields to update.",
    },
    "method_not_allowed": {
        "statusCode": 403,
        "message": "Forbidden: HTTP method not allowed.",
    },
    "record_not_found": {
        "statusCode": 404,
        "message": "Not Found: Record does not exist.",
    },
    "record_exists": {
        "statusCode": 409,
        "message": "Conflict: Record already exists.",
    },
    "internal_error": {
        "statusCode": 500,
        "message": "Internal Server Error.",
    },
}


def build_response(response_key, headers, addl_info=None):
    """Builds a standardized HTTP response.

    Args:
        response_key (str): The key for the response template.
        headers (dict): The HTTP headers.
        extra_data (dict, optional): Additional data to include in the response.

    Returns:
        dict: The HTTP response.
    """
    addl_info = addl_info or ""
    response: dict = responses.get(response_key, responses["internal_error"]).copy()
    headers["Content-Length"] = str(len(json.dumps(addl_info)))
    body = {"message": response["message"], "data": addl_info}
    return {
        "statusCode": response["statusCode"],
        "body": json.dumps(body),
        "headers": headers,
    }
