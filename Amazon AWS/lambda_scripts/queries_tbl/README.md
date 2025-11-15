# Test Data for Queries Table Lambda to Database Connection

## Table Structure

### All Fields

The following are the complete set of fields of the queries table where the data from forms submitted by website visitors are handled.
{
"id",
"timestamp",
"query",
"name",
"city",
"email_or_phone",
}

### Required Fields

The following are the required fields without which the POST method to create a record should fail. The timestamp field will be added by lambda - so no need to supply.
{
"id",
"timestamp",
"query",
"name",
"city",
}

### Primary Key

Primary key is the email_or_phone field. There is no validation at the backend for the contents. The frontend React SPA should take care of the validations.

## Basic method checks

### Test Data

#### Missing Method

This test is done to check what would happen if the method is not received by lambda.

The data to be used is as below:
{
"body": {
"query": "தத்வத்ரயம் என்றால் என்ன? நாம் அதை ஏன் தெரிந்துக்கொள்ள வேண்டும்?",
"name": "Balaji",
"city": "Bangalore"
}
}

The expected response is as below:
{
"statusCode": 400,
"headers": {
"Content-Type": "application/json",
"Content-Length": "24",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Bad Request: No method\""
}

#### Unsupported method

This test is done to check what would happen if the method is not received by lambda.

The data to be used is as below:
{
"httpMethod": "PATCH",
"body": {
"query": "தத்வத்ரயம் என்றால் என்ன? நாம் அதை ஏன் தெரிந்துக்கொள்ள வேண்டும்?",
"name": "Balaji",
"city": "Bangalore"
}
}

The expected response is as below:
{
"statusCode": 405,
"headers": {
"Content-Type": "application/json",
"Content-Length": "26",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Method Not Allowed PATCH\""
}

### badly formed JSON (sent as a string)

This test is done to see what happens when a badly formed JSON string is passed in.

The data to be used is as below (the closing " is missed out for full_name):
{
"httpMethod": "POST",
"body": "{\n \"query\": \"தத்வத்ரயம் என்றால் என்ன? நாம் அதை ஏன் தெரிந்துக்கொள்ள வேண்டும்??\",\n \"name\": \"Balaji,\n \"city\": \"Bangalore\"\n}"
}

The expected result is
{
"statusCode": 400,
"headers": {
"Content-Type": "application/json",
"Content-Length": "30",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Invalid JSON in request body\""
}

### POST Method Data

#### Key not present test

This test is cannot be done as the key is a computed field at the server end.

#### Missing required field(s)

This test is done to check what happens if a required field is not present.

The data to be used is as below ad it is missing the required field called "name":
{
"httpMethod": "POST",
"body": {
"query": "தத்வத்ரயம் என்றால் என்ன? நாம் அதை ஏன் தெரிந்துக்கொள்ள வேண்டும்?",
"city": "Bangalore"
}
}

The expected response is:
{
"statusCode": 400,
"headers": {
"Content-Type": "application/json",
"Content-Length": "14",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Invalid data\""
}

#### Successful POST Operation

This test is done to check to check success case.

The data to be used is as below:
{
"httpMethod": "POST",
"body": {
"query": "தத்வத்ரயம் என்றால் என்ன? நாம் அதை ஏன் தெரிந்துக்கொள்ள வேண்டும்?",
"name": "Balaji",
"city": "Bangalore",
"email_or_phone": "9890911836"
}
}

The expected response is:
{
"statusCode": 201,
"headers": {
"Content-Type": "application/json",
"Content-Length": "14",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Record added\""
}

Go the queries_tbl - scan and check if the record exists. It should be existing.

#### Duplicate submission - repeated primary key

Copy the primary key from the previously added record by going to the DynamoDb Explore Items page (e.g. f57d1c57-c84c-4bdc-9ee0-7bb3907d9c92). IT should be noted that there is no uniqueness for the other records and only ID is valid.

The data to be used is s below:
{
"httpMethod": "POST",
"body": {
"id": "f57d1c57-c84c-4bdc-9ee0-7bb3907d9c92",
"query": "தத்வத்ரயம் என்றால் என்ன? நாம் அதை ஏன் தெரிந்துக்கொள்ள வேண்டும்?",
"name": "Balaji",
"city": "Bangalore",
"email_or_phone": "9890911836"
}
}

The expected result is:
{
  "statusCode": 201,
  "headers": {
    "Content-Type": "application/json",
    "Content-Length": "14",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
  },
  "body": "\"Record added\""
}

Check in the log output for the following warning.
[WARNING]	2025-11-13T11:27:51.797Z	70187e70-6b4a-451c-aaaa-8e0b48717b37	Computed field 'id' provided. Overwriting with backend value.

And, check in the queries_tbl by scanning if a new record has been added.

#### Successful POST Operation - Only required fields

This test is done to check to check success case.

The data to be used is as below:
{
"httpMethod": "POST",
"body": {
"query": "தத்வத்ரயம் என்றால் என்ன? நாம் அதை ஏன் தெரிந்துக்கொள்ள வேண்டும்?",
"name": "Balaji",
"city": "Bangalore"
}
}

The expected response is:
{
"statusCode": 201,
"headers": {
"Content-Type": "application/json",
"Content-Length": "14",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Record added\""
}

Go the queries_tbl - scan and check if the record exists. It should be existing.

#### Successful POST operation - body as a string

This test is done to check to check success case.

The data to be used is as below:
{
  "httpMethod": "POST",
  "body": "{\n    \"query\": \"தத்வத்ரயம் என்றால் என்ன? நாம் அதை ஏன் தெரிந்துக்கொள்ள வேண்டும்?\",\n    \"name\": \"Balaji\",\n    \"city\": \"Bangalore\"\n  }"
}

The expected result is:
{
"statusCode": 201,
"headers": {
"Content-Type": "application/json",
"Content-Length": "14",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Record added\""
}

Go the queries_tbl - scan and check if the record exists. It should be existing.

### GET Method Data

#### Successful GET operation

This test is done to check to check success case.

The data to be sent is as follows:
{
"httpMethod": "GET"
}

The expected result is:
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Content-Length": "2554",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
  },
  "body": "[{\"city\": \"Bangalore\", \"email_or_phone\": null, \"id\": \"6738144a-3b8b-414c-bfdc-3bcfeac5c730\", \"query\": \"\\u0ba4\\u0ba4\\u0bcd\\u0bb5\\u0ba4\\u0bcd\\u0bb0\\u0baf\\u0bae\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0bb1\\u0bbe\\u0bb2\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0ba9? \\u0ba8\\u0bbe\\u0bae\\u0bcd \\u0b85\\u0ba4\\u0bc8 \\u0b8f\\u0ba9\\u0bcd \\u0ba4\\u0bc6\\u0bb0\\u0bbf\\u0ba8\\u0bcd\\u0ba4\\u0bc1\\u0b95\\u0bcd\\u0b95\\u0bca\\u0bb3\\u0bcd\\u0bb3 \\u0bb5\\u0bc7\\u0ba3\\u0bcd\\u0b9f\\u0bc1\\u0bae\\u0bcd?\", \"name\": \"Balaji\", \"timestamp\": \"2025-11-13T01:56:34.703154+00:00\"}, {\"city\": \"Bangalore\", \"email_or_phone\": \"9890911836\", \"id\": \"5583a687-60e0-4878-ac85-ee35f3dd26fe\", \"query\": \"\\u0ba4\\u0ba4\\u0bcd\\u0bb5\\u0ba4\\u0bcd\\u0bb0\\u0baf\\u0bae\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0bb1\\u0bbe\\u0bb2\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0ba9? \\u0ba8\\u0bbe\\u0bae\\u0bcd \\u0b85\\u0ba4\\u0bc8 \\u0b8f\\u0ba9\\u0bcd \\u0ba4\\u0bc6\\u0bb0\\u0bbf\\u0ba8\\u0bcd\\u0ba4\\u0bc1\\u0b95\\u0bcd\\u0b95\\u0bca\\u0bb3\\u0bcd\\u0bb3 \\u0bb5\\u0bc7\\u0ba3\\u0bcd\\u0b9f\\u0bc1\\u0bae\\u0bcd?\", \"name\": \"Balaji\", \"timestamp\": \"2025-11-13T00:41:42.568592+00:00\"}, {\"city\": \"Bangalore\", \"email_or_phone\": null, \"id\": \"502ef750-ab87-4661-977b-0b6218b778f9\", \"query\": \"\\u0ba4\\u0ba4\\u0bcd\\u0bb5\\u0ba4\\u0bcd\\u0bb0\\u0baf\\u0bae\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0bb1\\u0bbe\\u0bb2\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0ba9? \\u0ba8\\u0bbe\\u0bae\\u0bcd \\u0b85\\u0ba4\\u0bc8 \\u0b8f\\u0ba9\\u0bcd \\u0ba4\\u0bc6\\u0bb0\\u0bbf\\u0ba8\\u0bcd\\u0ba4\\u0bc1\\u0b95\\u0bcd\\u0b95\\u0bca\\u0bb3\\u0bcd\\u0bb3 \\u0bb5\\u0bc7\\u0ba3\\u0bcd\\u0b9f\\u0bc1\\u0bae\\u0bcd?\", \"name\": \"Balaji\", \"timestamp\": \"2025-11-13T00:45:00.683587+00:00\"}, {\"city\": \"Bangalore\", \"email_or_phone\": \"9890911836\", \"id\": \"5c78daf2-eafb-4749-abae-669d7d4ea606\", \"query\": \"\\u0ba4\\u0ba4\\u0bcd\\u0bb5\\u0ba4\\u0bcd\\u0bb0\\u0baf\\u0bae\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0bb1\\u0bbe\\u0bb2\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0ba9? \\u0ba8\\u0bbe\\u0bae\\u0bcd \\u0b85\\u0ba4\\u0bc8 \\u0b8f\\u0ba9\\u0bcd \\u0ba4\\u0bc6\\u0bb0\\u0bbf\\u0ba8\\u0bcd\\u0ba4\\u0bc1\\u0b95\\u0bcd\\u0b95\\u0bca\\u0bb3\\u0bcd\\u0bb3 \\u0bb5\\u0bc7\\u0ba3\\u0bcd\\u0b9f\\u0bc1\\u0bae\\u0bcd?\", \"name\": \"Balaji\", \"timestamp\": \"2025-11-13T00:41:35.946506+00:00\"}, {\"city\": \"Bangalore\", \"email_or_phone\": \"9890911836\", \"id\": \"de5a1e58-31c7-4723-b4c8-b29fce2ac566\", \"query\": \"\\u0ba4\\u0ba4\\u0bcd\\u0bb5\\u0ba4\\u0bcd\\u0bb0\\u0baf\\u0bae\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0bb1\\u0bbe\\u0bb2\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0ba9? \\u0ba8\\u0bbe\\u0bae\\u0bcd \\u0b85\\u0ba4\\u0bc8 \\u0b8f\\u0ba9\\u0bcd \\u0ba4\\u0bc6\\u0bb0\\u0bbf\\u0ba8\\u0bcd\\u0ba4\\u0bc1\\u0b95\\u0bcd\\u0b95\\u0bca\\u0bb3\\u0bcd\\u0bb3 \\u0bb5\\u0bc7\\u0ba3\\u0bcd\\u0b9f\\u0bc1\\u0bae\\u0bcd?\", \"name\": \"Balaji\", \"timestamp\": \"2025-11-13T00:41:00.466275+00:00\"}]"
}

### PUT Method Data

#### PUT - trying to modify non-existing record

Copy the primary key from the previously added record by going to the DynamoDb Explore Items page (e.g. f18aa749-f851-4380-b71b-766cb40f8b30) and delete the last character.

The test data should be:
{
"httpMethod": "PUT",
"body": {
"email_or_phone": "9890911836"
}
}

The expected output is:
{
  "statusCode": 404,
  "headers": {
    "Content-Type": "application/json",
    "Content-Length": "18",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
  },
  "body": "\"Record not found\""
}

#### PUT - data addition to existing record

This test is a success case for modifying previously null field with data.

The data to be used is as below. The primary key, which is "id" should be taken from the print out of the GET method:
{
"httpMethod": "PUT",
"body": {
    "id": "f18aa749-f851-4380-b71b-766cb40f8b30",
    "email_or_phone": "balaji@gmail.com"
}
}

The expected result is:
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Content-Length": "518",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
  },
  "body": "{\"city\": \"Bangalore\", \"email_or_phone\": \"balaji@gmail.com\", \"id\": \"6738144a-3b8b-414c-bfdc-3bcfeac5c730\", \"query\": \"\\u0ba4\\u0ba4\\u0bcd\\u0bb5\\u0ba4\\u0bcd\\u0bb0\\u0baf\\u0bae\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0bb1\\u0bbe\\u0bb2\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0ba9? \\u0ba8\\u0bbe\\u0bae\\u0bcd \\u0b85\\u0ba4\\u0bc8 \\u0b8f\\u0ba9\\u0bcd \\u0ba4\\u0bc6\\u0bb0\\u0bbf\\u0ba8\\u0bcd\\u0ba4\\u0bc1\\u0b95\\u0bcd\\u0b95\\u0bca\\u0bb3\\u0bcd\\u0bb3 \\u0bb5\\u0bc7\\u0ba3\\u0bcd\\u0b9f\\u0bc1\\u0bae\\u0bcd?\", \"name\": \"Balaji\", \"timestamp\": \"2025-11-13T02:44:09.197447+00:00\"}"

Go the queries - scan and check if the record is updated. It should be updated.

#### PUT - data change to existing record

This test is a success case for modifying previously null field with data.

The data to be used is as below and it missed the primary key called "email_or_phone":
{
"httpMethod": "PUT",
"body": {
    "id": "f18aa749-f851-4380-b71b-766cb40f8b30",
    "email_or_phone": "9890911836"
}
}

The expected result is:
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Content-Length": "512",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
  },
  "body": "{\"city\": \"Bangalore\", \"email_or_phone\": \"9890911836\", \"id\": \"6738144a-3b8b-414c-bfdc-3bcfeac5c730\", \"query\": \"\\u0ba4\\u0ba4\\u0bcd\\u0bb5\\u0ba4\\u0bcd\\u0bb0\\u0baf\\u0bae\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0bb1\\u0bbe\\u0bb2\\u0bcd \\u0b8e\\u0ba9\\u0bcd\\u0ba9? \\u0ba8\\u0bbe\\u0bae\\u0bcd \\u0b85\\u0ba4\\u0bc8 \\u0b8f\\u0ba9\\u0bcd \\u0ba4\\u0bc6\\u0bb0\\u0bbf\\u0ba8\\u0bcd\\u0ba4\\u0bc1\\u0b95\\u0bcd\\u0b95\\u0bca\\u0bb3\\u0bcd\\u0bb3 \\u0bb5\\u0bc7\\u0ba3\\u0bcd\\u0b9f\\u0bc1\\u0bae\\u0bcd?\", \"name\": \"Balaji\", \"timestamp\": \"2025-11-13T02:45:34.460283+00:00\"}"
}
Go the queries_tbl - scan and check if the record is updated. full_name should be updated.

### DELETE Method Data

#### DELETE - trying to delete non-existing record

This case is a failure case where we try to delete a non-existing record.

The data for this test is:
{
"httpMethod": "DELETE",
"body": {"id": "999999999999"}
}

The expected result is:
{
"statusCode": 404,
"headers": {
"Content-Type": "application/json",
"Content-Length": "18",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Record not found\""
}

#### DELETE - success case

This is for the success case. Collect the id data from DynamoDB.

The data for this test is:
{
"httpMethod": "DELETE",
"body": {"id": "f18aa749-f851-4380-b71b-766cb40f8b30"}
}

The expected result is:
{
"statusCode": 200,
"headers": {
"Content-Type": "application/json",
"Content-Length": "16",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Record deleted\""
}

Go to the queries_tbl. The data should not be existing.

### OPTIONS Method Data

#### OPTIONS - Only success case expected

This case tests the OPTIONS method needed for preflight CORS validation

The data for this test is:
{
"httpMethod": "OPTIONS"
}

The expeted result is:
{
"statusCode": 200,
"headers": {
"Content-Type": "application/json",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST, PUT, GET, DELETE, OPTIONS"
},
"body": ""
}
