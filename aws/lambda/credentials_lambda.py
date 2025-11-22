"""
AWS Lambda function to provide temporary AWS credentials using Cognito Identity Pools.
"""

import os
import json
import boto3  # pylint: disable=E0401
from botocore.exceptions import ClientError # pylint: disable=E0401

def lambda_handler(event, context):  # pylint: disable=W0613
    """
    Lambda function to retrieve temporary AWS credentials from Cognito Identity Pool.
    Expects the following environment variables to be set:
    - AWS_REGION: The AWS region where the Cognito Identity Pool is located.
    - COGNITO_IDENTITY_POOL_ID: The ID of the Cognito Identity Pool.
    - API_BASE_URL: The base URL for the API to be used by the client.
    """
    try:
        # Grab region from Lambda's own environment
        region = os.environ['AWS_REGION']
        identity_pool_id = os.environ['COGNITO_IDENTITY_POOL_ID']
        base_url = os.environ['API_BASE_URL']
        
        cognito_identity = boto3.client('cognito-identity', region_name=region)
        
        identity_response = cognito_identity.get_id(
            IdentityPoolId=identity_pool_id
        )
        identity_id = identity_response['IdentityId']
        
        credentials_response = cognito_identity.get_credentials_for_identity(
            IdentityId=identity_id
        )
        credentials = credentials_response['Credentials']
        
        body = {
            'accessKeyId': credentials['AccessKeyId'],
            'secretAccessKey': credentials['SecretKey'],
            'sessionToken': credentials['SessionToken'],
            'expiration': credentials['Expiration'].isoformat(),
            'region': region,
            'baseUrl': base_url
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(body)
        }
    
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
