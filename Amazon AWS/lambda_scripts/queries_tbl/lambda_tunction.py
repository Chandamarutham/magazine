"""
AWS Lambda function to manage subscription_tbl in DynamoDB.
Supports GET, POST, PUT, DELETE methods.
"""

# pylint: disable=W0613,W0718,E0401,R0911,R0912,R0914,R0915,C0206,W1404
import json
from datetime import datetime, timezone
from uuid import uuid4
import logging
import traceback
import boto3  # ignore: the library requirement on local machine or pip install it


# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # You can also use DEBUG, ERROR, etc.

# Uncomment line below for testing / comment out for production
# logger.setLevel(logging.DEBUG)

# Good to have this here - this will reduce connection overheads in "warm" executions :)
dynamodb = boto3.resource("dynamodb")
reserved_keys = {"timestamp", "name", "type", "reference"}


# --- Business requirements starts here ---
table = dynamodb.Table("queries_tbl")
all_fields: list = [
    "id",
    "timestamp",
    "query",
    "name",
    "city",
    "email_or_phone",
]

required_fields: list = [
    "id",
    "timestamp",
    "query",
    "name",
    "city",
]

computed_fields = {
    "id": lambda: str(uuid4()),
    "timestamp": lambda: datetime.now(timezone.utc).isoformat(),
}

key_field: str = "id"
# --- End of Business Requirement ---


################################# All Lambda Logic is below #################################
"""
Helper functions
"""


def get_allowed_origin(event) -> str | None:
    """Check if the request origin is allowed for CORS.

    Args:
        event (dict): The event data.

    Returns:
        str | None: The allowed origin or None if not allowed.
    """
    cors_allowed_origins = [
        "http://localhost:5173",  # For vite dev env - should be removed in production
        "https://magazine.chandamarutham.org",
    ]
    origin = event.get("headers", {}).get("origin") or event.get("headers", {}).get(
        "Origin"
    )
    if origin in cors_allowed_origins:
        return origin
    return None


def is_existing(key_value) -> bool:
    """Retrieve a subscription record by email_or_phone.

    Args:
        key_value (str): The key_value to look up.

    Returns:
        bool: True if the subscription record exists, else False.
    """
    response = table.get_item(Key={key_field: key_value})
    return response.get("Item") is not None


def make_response(status_code, body, event) -> dict:
    """Helper function to create HTTP responses.

    Args:
        status_code (int): HTTP status code.
        body (any): Response body.

    Returns:
        dict: Formatted HTTP response.
    """
    if body is None:
        body = {}  # or body = "" if you want empty string response

    json_body = json.dumps(body)

    origin = get_allowed_origin(event) if event else None
    headers = {
        "Content-Type": "application/json",
        "Content-Length": str(len(json_body)),
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE",
    }
    if origin:
        headers["Access-Control-Allow-Origin"] = origin

    return {
        "statusCode": status_code,
        "headers": headers,
        "body": json_body,
    }


def get_valid_method(event) -> tuple:
    """Extract and validate HTTP method from event.

    Args:
        event (dict): The event data.

    Returns:
        str: The HTTP method in uppercase.
    """
    method = event.get("httpMethod") or event.get("requestContext", {}).get(
        "http", {}
    ).get("method")
    if not method:
        logger.debug("No HTTP method found in event: %s", event)
        return None, 400, {"message": "Bad Request: No method"}

    method = method.upper()  # Convert it to upper case so that we can safely use it

    if method not in ["GET", "POST", "PUT", "DELETE", "OPTIONS"]:
        logger.debug("Method not allowed: %s", method)
        return None, 405, {"message": f"Method Not Allowed {method}"}
    return method, 200, None


def get_valid_body(event) -> tuple:
    """Extract and parse JSON body from event.

    Args:
        event (dict): The event data.

    Returns:
        tuple: Parsed JSON body or None if invalid, and an optional HTTP response.
    """
    body = event.get("body", "{}")
    # Always parse strings, including empty strings, to JSON
    if isinstance(body, str):
        # If an empty string is received for the body, treat as empty dict
        if not body.strip():
            body = {}
        else:
            try:
                body = json.loads(body)
            except Exception as e:
                logger.error(
                    "Error parsing body JSON: %s ; body was %s",
                    e,
                    event.get("body"),
                )
                return None, 400, {"message": "Invalid JSON in request body"}
    return body, 200, None


def get_valid_input(event, method, body) -> tuple:
    """Extract and validate item from request body.

    Args:
        method (str): The HTTP method.
        body (dict): The request body.

    Returns:
        tuple: Validated item or None if invalid, and an optional HTTP response.
    """
    item: dict = {}
    if method == "POST":
        # On POST, always generate computed fields (including key_field)
        for field in computed_fields:
            if field in body and body[field] != computed_fields[field]():
                logger.warning(
                    "Computed field '%s' provided. " "Overwriting with backend value.",
                    field,
                )
    # Populate item fields
    for field in all_fields:
        if method == "POST":
            # On POST, always generate computed fields (including key_field)
            if field in computed_fields:
                item[field] = computed_fields[field]()
            else:
                item[field] = body.get(field)
        else:  # PUT, DELETE, GET, etc.
            # On PUT/DELETE, do not generate key_field, get it from client
            # "id" if present should also be preserved as changing that can cause issues
            if field in [
                key_field,
                "id",
            ]:  # Let's make an exception for id, specially (although it is likely a key field)
                item[field] = body.get(field)
            # For other computed fields, generate new values
            elif field in computed_fields and field not in [key_field, "id"]:
                item[field] = computed_fields[field]()
            else:
                item[field] = body.get(field)
    # Validate required fields for POST
    if method == "POST":
        for field in required_fields:
            if not item.get(field):
                return None, 400, {"message": f"Missing required field: {field}"}
    return item, 200, None


def handle_options_request(event) -> tuple:
    """Handle OPTIONS request for CORS preflight.

    Returns:
        tuple: HTTP response for OPTIONS request.
    """
    return 200, {}


def handle_get_request(event) -> tuple:
    """Handle GET request to retrieve subscription records.

    Args:
        event (dict): The event data.

    Returns:
        dict: HTTP response with subscription records.
    """
    # Use query string or path parameters only
    key_value = (
        event.get("queryStringParameters", {}).get(key_field)
        if event.get("queryStringParameters")
        else None
    )
    if key_value is not None:
        # Get specific record logic
        response = table.get_item(Key={key_field: key_value})
        item = response.get("Item", {})
        if not item:
            logger.debug("Record not found with key: %s", key_value)
            return 404, {"message": "Record not found", key_field: key_value}
        return 200, item
    # Get all records
    response = table.scan()
    items = response.get("Items", [])
    return 200, items


def handle_post_request(key_value, item) -> dict:
    """Handle POST request to add a new subscription record.

    Args:
        key_value (str): The key value of the record.
        item (dict): The subscription item to add.

    Returns:
        tuple: HTTP response.
    """
    if is_existing(key_value):
        logger.debug("Record already exists with key: %s", key_value)
        return 409, {"message": "Record already exists", key_field: key_value}
    table.put_item(Item=item)
    return 201, {"message": "Record created", key_field: key_value}


def handle_delete_request(key_value) -> tuple:
    """Handle DELETE request to remove a subscription record.

    Args:
        key_value (str): The key value of the record.

    Returns:
        tuple: HTTP response.
    """
    if not is_existing(key_value):
        logger.debug("Record not found with key: %s", key_value)
        return 404, {"message": "Record not found", key_field: key_value}
    table.delete_item(Key={key_field: key_value})
    return 200, {"message": "Record deleted"}


def handle_put_request(key_value, item) -> tuple:
    """Handle PUT request to update a subscription record.

    Args:
        key_value (str): The key value of the record.
        item (dict): The subscription item to update.

    Returns:
        dict: HTTP response.
    """
    if not is_existing(key_value):
        logger.debug("Record not found with key: %s", key_value)
        return 404, {"message": "Record not found"}
    # Prepare update expression
    updated_fields = {k: v for k, v in item.items() if k != key_field and v is not None}
    if not updated_fields:
        logger.debug("No valid fields to update for key: %s", key_value)
        return 400, {"message": "No valid fields to update"}
    # Map reserved attribute names
    expression_attribute_names = {}
    update_expr_parts = []
    for idx, k in enumerate(updated_fields):
        # Use a placeholder for reserved keywords (like timestamp)
        if k in reserved_keys:
            placeholder = f"#{k}_{idx}"
            expression_attribute_names[placeholder] = k
            update_expr_parts.append(f"{placeholder} = :{k}")
        else:
            update_expr_parts.append(f"{k} = :{k}")
    # Construct the final update expression
    update_expr = "SET " + ", ".join(update_expr_parts)
    expr_attr_val: dict = {f":{k}": v for k, v in updated_fields.items()}
    # Perform the update
    response = table.update_item(
        Key={key_field: key_value},
        UpdateExpression=update_expr,
        ExpressionAttributeValues=expr_attr_val,
        # Only include if names exist
        **(
            {"ExpressionAttributeNames": expression_attribute_names}
            if expression_attribute_names
            else {}
        ),
        ReturnValues="ALL_NEW",
    )
    updated_item = response.get("Attributes", {})
    logger.info("Updated item: %s", updated_item)
    return 200, {"message": "Record updated", "item": updated_item}


################################# Lambda Handler #################################
def lambda_handler(event, context):
    """AWS Lambda handler function.

    Args:
        event (dict): The event data.
        context (object): The runtime information. (unused here)

    Returns:
        dict: HTTP response.
    """

    try:
        logger.debug("Full Lambda event: %s", json.dumps(event))

        method, response_code, body_to_send = get_valid_method(event)
        if method is None:
            return make_response(response_code, body_to_send, event)

        # Handle OPTIONS request separately for CORS preflight
        if method == "OPTIONS":
            response_code, body_to_send = handle_options_request(event)
            return make_response(response_code, body_to_send, event)

        if method == "GET":
            return handle_get_request(event)

        body, response_code, body_to_send = get_valid_body(event)
        if body is None:
            return make_response(response_code, body_to_send, event)

        item, response_code, body_to_send = get_valid_input(event, method, body)
        if not item:
            logger.debug("Invalid data in request body: %s", body_to_send)
            return make_response(response_code, body_to_send, event)

        key_value = item.get(key_field) or (
            event.get("queryStringParameters", {}).get(key_field)
            if event.get("queryStringParameters")
            else None
        )
        if not key_value:
            logger.debug("Missing key field '%s' in request", key_field)
            return make_response(
                400, {"message": f"Bad Request: Missing key field {key_field}"}, event
            )

        match method:
            case "POST":
                response_code, body_to_send = handle_post_request(key_value, item)
                return make_response(response_code, body_to_send, event)
            case "PUT":
                response_code, body_to_send = handle_put_request(key_value, item)
                return make_response(response_code, body_to_send, event)
            case "DELETE":
                response_code, body_to_send = handle_delete_request(key_value)
                return make_response(response_code, body_to_send, event)
            case _:
                logger.debug("Unsupported method: %s", method)
                return make_response(
                    400, {"message": f"Bad Request: Unsupported method {method}"}, event
                )
        # This point should not be reached - but put in for code safety
        return make_response(
            400,
            {"message": "Bad Request: No valid operation or unrecognized path"},
            event,
        )
    except Exception as exc:
        logger.error("Exception occurred: %s", exc)
        logger.error(traceback.format_exc())
        return make_response(
            500, {"message": f"Internal Server Error: {str(exc)}"}, event
        )
