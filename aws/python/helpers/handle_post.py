"""
Handles POST requests for creating records in DynamoDB.
"""
import json
from boto3.resource import Table


def handle_post(body) -> tuple[str, dict, dict]:
    """Handles POST requests.

    Args:
        body (str): The raw JSON string for the record.
        headers (dict): The HTTP headers.

    Returns:
        dict: The HTTP response.
    """
    # Parse the JSON body
    if body is None or (isinstance(body, str) and not body.strip()):
        return "invalid_json", "Empty body."
    data: dict = {}
    try:
        if isinstance(body, str):
            data = json.loads(body)
        elif isinstance(body, dict):
            data = body
    except json.JSONDecodeError:
        return "invalid_json", " Invalid JSON payload.")
    # Extract valid fields
    fields = extract_fields(data)
    # IF no valid fields, return error
    if not fields:
        return "no_valid_fields", 
    # If any required fields are missing, return error
    missing_fields = {field for field in required_fields if not fields.get(field)}
    if missing_fields:
        return 
            "missing_fields", headers, {"fields": list(missing_fields)}
        )
    # If record already exists, return error
    key_value = fields.get(key_field)
    if table.get_item(Key={key_field: key_value}).get("Item"):
        return build_response("record_exists", headers)
    # Create the record
    table.put_item(Item=fields)
    return build_response("created", headers, fields)