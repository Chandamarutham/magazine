# Test Data for Queries Table Lambda to Database Connection

## Table Structure

### All Fields

The following are the complete set of fields of the queries table where the data from forms submitted by website visitors are handled.
{
"id",
"timestamp",
"issue_date",
"details_of_error",
"location_of_error",
"name",
"city",
"email_or_phone",
}

### Required Fields

The following are the required fields without which the POST method to create a record should fail. The timestamp field will be added by lambda - so no need to supply.
{
"id",
"timestamp",
"issue_date",
"details_of_error",
"location_of_error",
"name",
"city",
}

### Primary Key

Primary key is the id field. There is no validation at the backend for the contents. The frontend React SPA should take care of the validations. It is a computed field

## Basic method checks

### Test Data

#### Missing Method

This test is done to check what would happen if the method is not received by lambda.

The data to be used is as below:
{
"body": {
"issue_date": "October 2025",
"details_of_error": "Name of acharya erumbiyappa is not shown correctly.",
"location_of_error": "Page 24",
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
"httpMethod": "Patch",
"body": {
"issue_date": "October 2025",
"details_of_error": "Name of acharya erumbiyappa is not shown correctly.",
"location_of_error": "Page 24",
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

The data to be used is as below (the closing " is missed out for details_of_error):
{
"httpMethod": "post",
"body": "{\n \"issue_date\": \"October 2025\",\n \"details_of_error: \"Name of acharya erumbiyappa is not shown correctly.\",\n \"location_of_error\": \"Page 24\",\n \"name\": \"Balaji\",\n \"city\": \"Bangalore\"\n}"
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

This test cannot be done as the key is a computed field at the server end.

#### Missing required field(s)

This test is done to check what happens if a required field is not present.

The data to be used is as below ad it is missing the required field called "name":
{
"httpMethod": "post",
"body": {
"details_of_error": "Name of acharya erumbiyappa is not shown correctly.",
"location_of_error": "Page 24",
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
"httpMethod": "post",
"body": {
"issue_date": "October 2025",
"details_of_error": "Name of acharya erumbiyappa is not shown correctly.",
"location_of_error": "Page 24",
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

Go the err_report_tbl - scan and check if the record exists. It should be existing.

#### Duplicate submission - repeated primary key

Copy the primary key from the previously added record by going to the DynamoDb Explore Items page (e.g. dbab00dd-a83e-448b-9909-9a21c66a97c5). IT should be noted that there is no uniqueness for the other records and only ID is valid.

The data to be used is s below:
{
"httpMethod": "post",
"body": {
"id": "dbab00dd-a83e-448b-9909-9a21c66a97c5",
"issue_date": "October 2025",
"details_of_error": "Name of acharya erumbiyappa is not shown correctly.",
"location_of_error": "Page 24",
"name": "Balaji",
"city": "Bangalore"
}
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

Check in the log output for the following warning.
[WARNING] 2025-11-13T11:27:51.797Z 70187e70-6b4a-451c-aaaa-8e0b48717b37 Computed field 'id' provided. Overwriting with backend value.

And, check in the err_report_tbl by scanning if a new record has been added.

#### Successful POST Operation - Only required fields

This test is done to check to check success case.

The data to be used is as below:
{
"httpMethod": "post",
"body": {
"issue_date": "October 2025",
"details_of_error": "Name of acharya erumbiyappa is not shown correctly.",
"location_of_error": "Page 24",
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

Go the err_report_tbl - scan and check if the record exists. It should be existing.

#### Successful POST operation - body as a string

This test is done to check to check success case.

The data to be used is as below:
{
"httpMethod": "post",
"body": "{\n \"issue_date\": \"October 2025\",\n \"details_of_error\": \"Name of acharya erumbiyappa is not shown correctly.\",\n \"location_of_error\": \"Page 24\",\n \"name\": \"Giri\",\n \"city\": \"Bangalore\",\n \"email_or_phone\": \"9890911836\"\n }"
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

Go the err_report_tbl - scan and check if the record exists. It should be existing.

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
"Content-Length": "1202",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "[{\"issue_date\": \"October 2025\", \"city\": \"Bangalore\", \"email_or_phone\": null, \"timestamp\": \"2025-11-13T13:10:23.924997+00:00\", \"details_of_error\": \"Name of acharya erumbiyappa is not shown correctly.\", \"id\": \"dbab00dd-a83e-448b-9909-9a21c66a97c5\", \"name\": \"Balaji\", \"location_of_error\": \"Page 24\"}, {\"issue_date\": \"October 2025\", \"city\": \"Bangalore\", \"email_or_phone\": \"9890911836\", \"timestamp\": \"2025-11-13T13:13:28.804453+00:00\", \"details_of_error\": \"Name of acharya erumbiyappa is not shown correctly.\", \"id\": \"30760202-0a18-44e1-9dad-9e6be4018307\", \"name\": \"Balaji\", \"location_of_error\": \"Page 24\"}, {\"issue_date\": \"October 2025\", \"city\": \"Bangalore\", \"email_or_phone\": \"9890911836\", \"timestamp\": \"2025-11-13T13:15:48.313097+00:00\", \"details_of_error\": \"Name of acharya erumbiyappa is not shown correctly.\", \"id\": \"87a2cb2f-597b-4306-8e76-e6c56938b594\", \"name\": \"Giri\", \"location_of_error\": \"Page 24\"}, {\"issue_date\": \"October 2025\", \"city\": \"Bangalore\", \"email_or_phone\": null, \"timestamp\": \"2025-11-13T13:11:49.938718+00:00\", \"details_of_error\": \"Name of acharya erumbiyappa is not shown correctly.\", \"id\": \"b0b44540-b1cb-4807-a410-d6e9a6a2572c\", \"name\": \"Balaji\", \"location_of_error\": \"Page 24\"}]"
}

### PUT Method Data

#### PUT - trying to modify non-existing record

Copy the primary key from the previously added record by going to the DynamoDb Explore Items page (e.g. fdbab00dd-a83e-448b-9909-9a21c66a97c5) and delete the last character.

The test data should be:
{
"httpMethod": "PUT",
"body": {
"id": "dbab00dd-a83e-448b-9909-9a21c66a97",
"email_or_phone": "balaji@gmail.com"
}
}

The expected output is:
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

#### PUT - data addition to existing record

This test is a success case for modifying previously null field with data.

The data to be used is as below. The primary key, which is "id" should be taken from the print out of the GET method:
{
"httpMethod": "PUT",
"body": {
"id": "dbab00dd-a83e-448b-9909-9a21c66a97c5",
"email_or_phone": "balaji@gmail.com"
}
}

The expected result is:
{
"statusCode": 200,
"headers": {
"Content-Type": "application/json",
"Content-Length": "518",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "{\"city\": \"Bangalore\", \"issue_date\": \"October 2025\", \"email_or_phone\": \"balaji@gmail.com\", \"timestamp\": \"2025-11-13T14:00:33.843696+00:00\", \"details_of_error\": \"Name of acharya erumbiyappa is not shown correctly.\", \"id\": \"dbab00dd-a83e-448b-9909-9a21c66a97c5\", \"name\": \"Balaji\", \"location_of_error\": \"Page 24\"}"
}
Go the queries - scan and check if the record is updated. It should be updated.

#### PUT - data change to existing record

This test is a success case for modifying previously null field with data.

The data to be used is as below and it missed the primary key called "email_or_phone":
{
"httpMethod": "PUT",
"body": {
"id": "dbab00dd-a83e-448b-9909-9a21c66a97c5",
"email_or_phone": "9890911836"
}
}

The expected result is:
{
"statusCode": 200,
"headers": {
"Content-Type": "application/json",
"Content-Length": "512",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "{\"city\": \"Bangalore\", \"issue_date\": \"October 2025\", \"email_or_phone\": \"9890911836\", \"timestamp\": \"2025-11-13T14:01:55.043334+00:00\", \"details_of_error\": \"Name of acharya erumbiyappa is not shown correctly.\", \"id\": \"dbab00dd-a83e-448b-9909-9a21c66a97c5\", \"name\": \"Balaji\", \"location_of_error\": \"Page 24\"}"
}
Go the err_report_tbl - scan and check if the record is updated. full_name should be updated.

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
"body": {"id": "dbab00dd-a83e-448b-9909-9a21c66a97c5"}
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

Go to the err_report_tbl. The data should not be existing.

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
