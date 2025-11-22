"""
Module to get a specified DynamoDB table.
"""

# Pylint disables
# pylint: pylint: disable=E0401,W0613,W0718
import boto3


def get_table(table_name):
    """
    Get a DynamoDB table.

    :param table_name: Name of the DynamoDB table.
    :return: The DynamoDB Table resource.
    """
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(table_name)
    return table
