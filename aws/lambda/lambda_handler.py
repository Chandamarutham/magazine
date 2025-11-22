"""
AWS Lambda function to manage feedback-table in DynamoDB.
Supports GET, POST, OPTIONS methods.
"""

# Pylint disables
# pylint: disable=E0401,W0613,W0718
import json
from datetime import datetime, timezone, timedelta
from uuid import uuid4
import logging
import traceback

from python.helpers import (
    get_table,
    build_cors_headers,
    extract_method_and_body,
    build_response,
    field_definitions,
    handle_get,
    handle_post,
)

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
# logger.setLevel(logging.DEBUG)  # Uncomment this line for debugging

# Setup the table details
table_name: str = "feedback-table"
table = get_table(table_name)

# The following are the fiedls in the table
all_fields: set = field_definitions[table_name]["all"]
required_fields: set = field_definitions[table_name]["required"]
key_field: str = field_definitions[table_name]["key"]


# The following are the computed fields in the table
computed_fields: dict = {
    "id": lambda: str(uuid4()),
    "date_modified": lambda: datetime.now(
        timezone(timedelta(hours=5, minutes=30))
    ).isoformat(),
}



# Allowed HTTP methods
allowed_methods: set = {"GET", "POST", "OPTIONS"}

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

# Allowed CORS origins
app_env: str = os.environ.get("APP_ENV", "dev")
if app_env == "prod":
    cors_allowed_origins: list[str] = [
        "https://magazine.chandamarutham.org",
    ]
else:
    cors_allowed_origins: list[str] = [
        "http://localhost:5173",
        "https://magazine.chandamarutham.org",
    ]


# Helper functions
def get_allowed_origin(event) -> str | None:
    """Check if the request origin is allowed for CORS.

    Args:
        event (dict): The event data.

    Returns:
        str | None: The allowed origin or None if not allowed.
    """
    origin = None
    if event and event.get("headers"):
        origin = event["headers"].get("origin")
    if origin in cors_allowed_origins:
        return origin
    return None


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
    allowed_origin = get_allowed_origin(event)
    if allowed_origin:
        headers["Access-Control-Allow-Origin"] = allowed_origin
    return headers


def extract_method(event) -> tuple[str, dict, dict | None]:
    """Extracts the HTTP method and relevant data from the event.

    Args:
        event (dict): The event data.

    Returns:
        tuple: (method, response_key, additional_info)
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
        key_value = query_params.get(key_field)
        limit = query_params.get("limit")
        exclusive_start_key_str = query_params.get("ExclusiveStartKey")
        addl_info = {
            key_field: key_value,
            "limit": limit,
            "ExclusiveStartKey": exclusive_start_key_str,
        }
        return method, "ok", addl_info
    return method, "ok", event.get("body", {})


def extract_fields(data: dict) -> dict:
    """Extracts valid fields from the input data.
        Also enriches with computed fields.
        This is required for POST requests.

    Args:
        data (dict): The input data.

    Returns:
        dict: The extracted valid fields.
    """
    fields: dict = {}

    # Warn if computed fields are in input data
    for field in computed_fields:
        if field in data:
            logger.warning(
                "Computed field '%s' found in input data. It will be overwritten.",
                field,
            )
    # Add valid fields non-null from input data
    for field in all_fields:
        if field in computed_fields:
            fields[field] = computed_fields[field]()
        else:
            val = data.get(field)
            if val is not None:
                fields[field] = val
    # SAFETY CHECK: Ensure key_field is present and valid after
    if key_field not in fields or not fields.get(key_field):
        # Depending on your needs, you could log, raise, or return {}
        logger.warning(
            "Primary key_field '%s' missing or empty after field extraction.", key_field
        )
        return {}
    return fields




def lambda_handler(event, context):
    """Main Lambda handler function.

    Args:
        event (dict): The event data from API Gateway.
        context (object): The runtime information of the Lambda function.

    Returns:
        dict: The HTTP response.
    """
    try:
        logger.debug("Event received: %s", json.dumps(event))

        # Prepare CORS headers
        headers = build_cors_headers(event)
        method, response, addl_info = extract_method(event)

        if response != "ok":
            return build_response(response, headers, addl_info)

        if method == "OPTIONS":
            return build_response("ok", headers)
        if method == "GET":
            return handle_get(addl_info, headers)
        if method == "POST":
            return handle_post(addl_info, headers)
        # Send the error response for unsupported methods
        return build_response(response, headers)
    except Exception as e:
        logger.error("Exception occurred: %s", str(e))
        logger.debug(traceback.format_exc())
        return build_response("internal_error", build_cors_headers(event), str(e))
