"""
Helper to get data stored in a DynamoDB table.
"""
# Pylint disables
# pylint: pylint: disable=E0401,W0613,W0718
import json
from boto3.resource import Table


def handle_get(key_field: str, addl_info: dict, table: Table) -> tuple[str, dict | None]:
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
            return "record_not_found", None
        return "ok", response_item
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
    return "ok", response_data
