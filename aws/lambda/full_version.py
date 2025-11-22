"""
AWS Lambda function to manage feedback-table in DynamoDB.
Supports GET, POST, OPTIONS methods.
"""

# Pylint disables
# pylint: pylint: disable=E0401,W0613,W0718
import json
from datetime import datetime, timezone, timedelta
from uuid import uuid4
import logging
import traceback
import os
import boto3


# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
# logger.setLevel(logging.DEBUG)  # Uncomment this line for debugging

# Setup the table details
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("feedback-table")
reserved_keys = {"timestamp", "name", "type", "reference"}

# The following are the fiedls in the table
all_fields: set = {
    "id",
    "date_modified",
    "issue_date",
    "details_of_error",
    "location_of_error",
    "name_of_person",
    "name_of_city",
    "email_or_phone",
}

# The following are the required fields in the table
required_fields: set = {
    "id",
    "date_modified",
    "issue_date",
    "details_of_error",
    "location_of_error",
    "name_of_person",
    "name_of_city",
}

# The following are the computed fields in the table
computed_fields: dict = {
    "id": lambda: str(uuid4()),
    "date_modified": lambda: datetime.now(
        timezone(timedelta(hours=5, minutes=30))
    ).isoformat(),
}

# Primary key field
key_field: str = "id"

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
    logger.debug("Headers received: %s", event.get("headers", {}))
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
    body = {
        "message": response["message"],
        "data": addl_info
    }
    return {
        "statusCode": response["statusCode"],
        "body": json.dumps(body),
        "headers": headers,
    }


def handle_get(addl_info, headers):
    """Handles GET requests.

    Args:
        addl_info (dict): Additional information extracted from the request.
        headers (dict): The HTTP headers.

    Returns:
        dict: The HTTP response.
    """
    if addl_info.get(key_field) is not None:
        response_item = table.get_item(Key={key_field: addl_info.get(key_field)}).get(
            "Item"
        )
        if not response_item:
            return build_response("record_not_found", headers)
        return build_response("ok", headers, response_item)
    # Extract limit and ExclusiveStartKey from addl_info
    try:
        limit = int(addl_info.get("limit", 10))  # Default to 10 if missing or invalid
    except (TypeError, ValueError):
        limit = 10

    start_key_str = addl_info.get("ExclusiveStartKey")
    exclusive_start_key = None
    if start_key_str:
        try:
            exclusive_start_key = json.loads(start_key_str)
        except json.JSONDecodeError:
            # Handle invalid token gracefully (e.g., ignore or respond with error)
            exclusive_start_key = None

    # Build scan parameters
    scan_kwargs = {"Limit": limit}
    if exclusive_start_key:
        scan_kwargs["ExclusiveStartKey"] = exclusive_start_key

    # Perform the scan
    scan_response = table.scan(**scan_kwargs)
    items = scan_response.get("Items", [])
    last_key = scan_response.get("LastEvaluatedKey")
    response_data = {
        "items": items,
        "lastEvaluatedKey": last_key,
    }
    return build_response("ok", headers, response_data)


def handle_post(body, headers):
    """Handles POST requests.

    Args:
        body (str): The raw JSON string for the record.
        headers (dict): The HTTP headers.

    Returns:
        dict: The HTTP response.
    """
    # Parse the JSON body
    if body is None or (isinstance(body, str) and not body.strip()):
        return build_response("invalid_json", headers, "Empty body.")
    data: dict = {}
    try:
        if isinstance(body, str):
            data = json.loads(body)
        elif isinstance(body, dict):
            data = body
    except json.JSONDecodeError:
        return build_response("invalid_json", headers, " Invalid JSON payload.")
    # Extract valid fields
    fields = extract_fields(data)
    # IF no valid fields, return error
    if not fields:
        return build_response("no_valid_fields", headers)
    # If any required fields are missing, return error
    missing_fields = {field for field in required_fields if not fields.get(field)}
    if missing_fields:
        return build_response(
            "missing_fields", headers, {"fields": list(missing_fields)}
        )
    # If record already exists, return error
    key_value = fields.get(key_field)
    if table.get_item(Key={key_field: key_value}).get("Item"):
        return build_response("record_exists", headers)
    # Create the record
    table.put_item(Item=fields)
    return build_response("created", headers, fields)


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
