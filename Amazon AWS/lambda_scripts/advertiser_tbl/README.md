# Test Data for Queries Table Lambda to Database Connection

## Table Structure

### All Fields

The following are the complete set of fields of the queries table where the data from forms submitted by website visitors are handled.
{
"email",
"company_name",
"contact_person_name",
"phone",
"website",
"business_type",
"advert_type",
"ad_place_preference",
"budget",
"reference",
}

### Required Fields

The following are the required fields without which the POST method to create a record should fail. The timestamp field will be added by lambda - so no need to supply.
{
"email",
"company_name",
"contact_person_name",
"phone",
"business_type",
}

### Primary Key

Primary key is the email field.

## Basic method checks

### Test Data

#### Missing Method

This test is done to check what would happen if the method is not received by lambda.

The data to be used is as below:
{
"body": {
"email": "abc@xyx.com",
"company_name": "XYZ Corp",
"contact_person_name": "Narayanan",
"phone": "91-20-36879875",
"business_type": "Puja items"
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
"email": "abc@xyx.com",
"company_name": "XYZ Corp",
"contact_person_name": "Narayanan",
"phone": "91-20-36879875",
"business_type": "Puja items"
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

The data to be used is as below (the closing " is missed out for contact_person_name):
{
"httpMethod": "post",
"body": "{\"email\": \"abc@xyx.com\",\"company_name\": \"XYZ Corp\",\"contact_person_name: \"Narayanan\",\"phone\": \"91-20-36879875\",\"business_type\": \"Puja items\"
}"
}
The expected result is
{
"statusCode": 400,
"headers": {
"Content-Type": "application/json",
"Content-Length": "30",
"Access-Control-Allow-Origin": "\*",
"Access-Control-Allow-Headers": "\_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Invalid JSON in request body\""
}

### POST Method Data

#### Key not present test

This test is done to check what would happen if the primary key is not given in the POST request.

The data to be used is as below and it missed the primary key called "email":
{
"httpMethod": "POST",
"body": {
"company_name": "XYZ Corp",
"contact_person_name": "Narayanan",
"phone": "91-20-36879875",
"business_type": "Puja items"
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

#### Missing required field(s)

This test is done to check what happens if a required field is not present.

The data to be used is as below ad it is missing the required field called "company_name":
{
"httpMethod": "POST",
"body": {
"email": "abc@xyz.com",
"contact_person_name": "Narayanan",
"phone": "91-20-36879875",
"business_type": "Puja items"
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
"email": "xyz@abc.com",
"company_name": "ABC Corp",
"contact_person_name": "Narayanan",
"phone": "91-20-36879875",
"business_type": "Puja items",
"advert_type": "Full Page Colour",
"ad_place_preference": "Back Page,Inside Covers",
"budget": ">50,000/-",
"reference": "Mrs Bhama"
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

Go the advertiser_tbl - scan and check if the record exists. It should be existing.

#### Duplicate submission - repeated primary key

Resubmit the same test done for the successful record creation above. Since the email information already exists it should fail.

The expected result is:
{
"statusCode": 409,
"headers": {
"Content-Type": "application/json",
"Content-Length": "23",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "\"Record already exists\""
}

#### Successful POST Operation - Only required fields

This test is done to check to check success case.

The data to be used is as below:
The data to be used is as below:
{
"httpMethod": "POST",
"body": {
"email": "abc@xyz.com",
"company_name": "XYZ Corp",
"contact_person_name": "Narayanan",
"phone": "91-20-36879875",
"business_type": "Puja items"
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

Go the advertiser_tbl - scan and check if the record exists. It should be existing.

#### Successful POST operation - body as a string

This test is done to check to check success case.

The data to be used is as below:
{
	"email": "xyz@123.com",
	"company_name": "123 Corp",
	"contact_person_name": "Narayanan",
	"phone": "91-20-36879875",
	"business_type": "Puja items"
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

Go the advertiser_tbl - scan and check if the record exists. It should be existing.

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
"Content-Length": "798",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "[{\"ad_place_preference\": null, \"website\": null, \"advert_type\": null, \"company_name\": \"123 Corp\", \"business_type\": \"Puja items\", \"budget\": null, \"contact_person_name\": \"Madhavan\", \"email\": \"xyz@123.com\", \"phone\": \"91-20-36879875\", \"reference\": null}, {\"ad_place_preference\": \"Back Page,Inside Covers\", \"website\": null, \"advert_type\": \"Full Page Colour\", \"company_name\": \"ABC Corp\", \"business_type\": \"Puja items\", \"budget\": \">50,000/-\", \"contact_person_name\": \"Narayanan\", \"email\": \"xyz@abc.com\", \"phone\": \"91-20-36879875\", \"reference\": \"Mrs Bhama\"}, {\"ad_place_preference\": null, \"website\": null, \"advert_type\": null, \"company_name\": \"XYZ Corp\", \"business_type\": \"Puja items\", \"budget\": null, \"contact_person_name\": \"Narayanan\", \"email\": \"abc@xyz.com\", \"phone\": \"91-20-36879875\", \"reference\": null}]"
}

### PUT Method Data

#### PUT - trying to modify non-existing record

This test is to see what happens if a modification is sent for a non-existing record.
The test data should be:
{
"httpMethod": "PUT",
"body": {
"email": "abc@abc.com",
"reference": "Mrs Bhama"
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

The data to be used is as below:
{
"httpMethod": "PUT",
"body": {
"email": "xyz@123.com",
"reference": "Mrs Bhama"
}
}

{
"statusCode": 200,
"headers": {
"Content-Type": "application/json",
"Content-Length": "303",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "{\"ad_place_preference\": null, \"advert_type\": null, \"website\": null, \"company_name\": \"123 Corp\", \"business_type\": \"Puja items\", \"budget\": null, \"timestamp\": \"2025-11-13T15:55:38.434767+00:00\", \"contact_person_name\": \"Madhavan\", \"email\": \"xyz@123.com\", \"phone\": \"91-20-36879875\", \"reference\": \"Mrs Bhama\"}"
}

Go to the table - scan and check if the record is updated. It should be updated.

#### PUT - data change to existing record

This test is a success case for modifying previously null field with data.

The data to be used is as below and it missed the primary key called "email_or_phone":
{
"httpMethod": "PUT",
"body": {
"email": "xyz@123.com",
"reference": "Mr Balaji"
}
}

The expected result is:
{
"statusCode": 200,
"headers": {
"Content-Type": "application/json",
"Content-Length": "303",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "{\"ad_place_preference\": null, \"advert_type\": null, \"website\": null, \"company_name\": \"123 Corp\", \"business_type\": \"Puja items\", \"budget\": null, \"timestamp\": \"2025-11-13T15:57:12.709004+00:00\", \"contact_person_name\": \"Madhavan\", \"email\": \"xyz@123.com\", \"phone\": \"91-20-36879875\", \"reference\": \"Mr Balaji\"}"
}
Go the advertiser_tbl - scan and check if the record is updated. full_name should be updated.

### DELETE Method Data

#### DELETE - trying to delete non-existing record

This case is a failure case where we try to delete a non-existing record.

The data for this test is:
{
"httpMethod": "DELETE",
"body": {"email": "999@99999.9999"}
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
"body": {"email": "xyz@123.com"}
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

Go to the advertiser_tbl. The data should not be existing.

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
