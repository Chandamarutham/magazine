# Test Data for Subscription Table Lambda to Database Connection

## Table Structure

### All Fields

The following are the complete set of fields of the subscription table where the data from forms submitted by website visitors are handled.
{
"email_or_phone",
"timestamp",
"full_name",
"thirumaligai",
"interests",
"samashrayanam",
"acharyan_name",
"address_line_1",
"address_line_2",
"city",
"postal_code",
"state_or_province",
"country",
"authorisation",
}

### Required Fields

The following are the required fields without which the POST method to create a record should fail. The timestamp field will be added by lambda - so no need to supply.
{
"email_or_phone",
"full_name",
"address_line_1",
"city",
"postal_code",
"state_or_province",
"country",
"authorisation",
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
"email_or_phone": "9890911836",
"full_name": "Balaji Srinivasa",
"thirumaligai": "Sri KKC Periyappangar Swamy Thirumaligai",
"interests": "Rahasya Granthams, Divyaprabandham, Purvacharya Vaibhavam",
"samashrayanam": "Done already",
"acharyan_name": "Sri Koyil Kandhadai Chandamarutham Doddaiyachar (Yoganrsimhan Swamy)",
"address_line_1": "12133 Prestige Falcon City",
"address_line_2": "Kanakapura Main Rd, Anjanadri Layout",
"city": "Bengaluru",
"postal_code": "560062",
"state_or_province": "Karnataka",
"country": "India",
"authorisation": "Yes"
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
"email_or_phone": "9890911836",
"full_name": "Balaji Srinivasa",
"thirumaligai": "Sri KKC Periyappangar Swamy Thirumaligai",
"interests": "Rahasya Granthams, Divyaprabandham, Purvacharya Vaibhavam",
"samashrayanam": "Done already",
"acharyan_name": "Sri Koyil Kandhadai Chandamarutham Doddaiyachar (Yoganrsimhan Swamy)",
"address_line_1": "12133 Prestige Falcon City",
"address_line_2": "Kanakapura Main Rd, Anjanadri Layout",
"city": "Bengaluru",
"postal_code": "560062",
"state_or_province": "Karnataka",
"country": "India",
"authorisation": "Yes"
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
"body": "{\"email_or_phone\": \"veera@gmail.com\", \"full_name\": \"Veera Srinivasan, \"address_line_1\": \"12133 Prestige Falcon City\", \"city\": \"Bengaluru\", \"postal_code\": \"560062\", \"state_or_province\": \"Karnataka\", \"country\": \"India\", \"authorisation\": \"Yes\"}"
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

This test is done to check what would happen if the primary key is not given in the POST request.

The data to be used is as below and it missed the primary key called "email_or_phone":
{
"httpMethod": "POST",
"body": {
"full_name": "Balaji Srinivasa",
"thirumaligai": "Sri KKC Periyappangar Swamy Thirumaligai",
"interests": "Rahasya Granthams, Divyaprabandham, Purvacharya Vaibhavam",
"samashrayanam": "Done already",
"acharyan_name": "Sri Koyil Kandhadai Chandamarutham Doddaiyachar (Yoganrsimhan Swamy)",
"address_line_1": "12133 Prestige Falcon City",
"address_line_2": "Kanakapura Main Rd, Anjanadri Layout",
"city": "Bengaluru",
"postal_code": "560062",
"state_or_province": "Karnataka",
"country": "India",
"authorisation": "Yes"
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

The data to be used is as below ad it is missing the required field called "address_line_1":
{
"httpMethod": "POST",
"body": {
"email_or_phone": "9890911836",
"full_name": "Balaji Srinivasa",
"thirumaligai": "Sri KKC Periyappangar Swamy Thirumaligai",
"city": "Bengaluru",
"postal_code": "560062",
"state_or_province": "Karnataka",
"country": "India",
"authorisation": "Yes"
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
"email_or_phone": "9890911836",
"full_name": "Balaji Srinivasa",
"thirumaligai": "Sri KKC Periyappangar Swamy Thirumaligai",
"interests": "Rahasya Granthams, Divyaprabandham, Purvacharya Vaibhavam",
"samashrayanam": "Done already",
"acharyan_name": "Sri Koyil Kandhadai Chandamarutham Doddaiyachar (Yoganrsimhan Swamy)",
"address_line_1": "12133 Prestige Falcon City",
"address_line_2": "Kanakapura Main Rd, Anjanadri Layout",
"city": "Bengaluru",
"postal_code": "560062",
"state_or_province": "Karnataka",
"country": "India",
"authorisation": "Yes"
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

Go the subscriptions_tbl - scan and check if the record exists. It should be existing.

#### Duplicate submission - repeated primary key

Execute the previous case again - without deleting the record on the database and without changing any field.

The expected response is:
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
{
"httpMethod": "POST",
"body": {
"email_or_phone": "9960411836",
"full_name": "Balaji Srinivasa",
"address_line_1": "12133 Prestige Falcon City",
"city": "Bengaluru",
"postal_code": "560062",
"state_or_province": "Karnataka",
"country": "India",
"authorisation": "Yes"
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

Go the subscriptions_tbl - scan and check if the record exists. It should be existing.

#### Successful POST operation - body as a string

This test is done to check to check success case.

The data to be used is as below:
{
"httpMethod": "POST",
"body": "{\n \"email_or_phone\": \"7498760234\",\n \"full_name\": \"Veera Srinivasan\",\n \"address_line_1\": \"12133 Prestige Falcon City\",\n \"city\": \"Bengaluru\",\n \"postal_code\": \"560062\",\n \"state_or_province\": \"Karnataka\",\n \"country\": \"India\",\n \"authorisation\": \"Yes\"\n }"
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

Go the subscriptions_tbl - scan and check if the record exists. It should be existing.

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
"Content-Length": "1400",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "[{\"acharyan_name\": \"Sri Koyil Kandhadai Chandamarutham Doddaiyachar (Yoganrsimhan Swamy)\", \"timestamp\": \"2025-11-12T08:38:53.505857+00:00\", \"authorisation\": \"Yes\", \"full_name\": \"Balaji Srinivasa\", \"country\": \"India\", \"postal_code\": \"560062\", \"city\": \"Bengaluru\", \"email_or_phone\": \"9890911836\", \"samashrayanam\": \"Done already\", \"address_line_1\": \"12133 Prestige Falcon City\", \"interests\": \"Rahasya Granthams, Divyaprabandham, Purvacharya Vaibhavam\", \"address_line_2\": \"Kanakapura Main Rd, Anjanadri Layout\", \"thirumaligai\": \"Sri KKC Periyappangar Swamy Thirumaligai\", \"state_or_province\": \"Karnataka\"}, {\"acharyan_name\": null, \"timestamp\": \"2025-11-12T10:19:28.824590+00:00\", \"authorisation\": \"Yes\", \"full_name\": \"Veera Srinivasan\", \"country\": \"India\", \"postal_code\": \"560062\", \"city\": \"Bengaluru\", \"email_or_phone\": \"7498760234\", \"samashrayanam\": null, \"address_line_1\": \"12133 Prestige Falcon City\", \"interests\": null, \"address_line_2\": null, \"thirumaligai\": null, \"state_or_province\": \"Karnataka\"}, {\"acharyan_name\": null, \"timestamp\": \"2025-11-12T10:09:36.351392+00:00\", \"authorisation\": \"Yes\", \"full_name\": \"Balaji Srinivasa\", \"country\": \"India\", \"postal_code\": \"560062\", \"city\": \"Bengaluru\", \"email_or_phone\": \"9960411836\", \"samashrayanam\": null, \"address_line_1\": \"12133 Prestige Falcon City\", \"interests\": null, \"address_line_2\": null, \"thirumaligai\": null, \"state_or_province\": \"Karnataka\"}]"
}

### PUT Method Data

#### PUT - trying to modify non-existing record

This test is done to check what would happen if a record that is not in the table is sought.

The data to be used is as below and it has an non-existent the primary key called "email_or_phone":
{
"httpMethod": "PUT",
"body": {
"email_or_phone": "7777777777",
"thirumaligai": "Sri KKC Periyappangar Swamy Thirumaligai",
"interests": "Rahasya Granthams, Divyaprabandham, Purvacharya Vaibhavam",
"samashrayanam": "Done already",
"acharyan_name": "Sri Koyil Kandhadai Chandamarutham Doddaiyachar (Yoganrsimhan Swamy)"
}
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

#### PUT - data addition to existing record

This test is a success case for modifying previously null field with data.

The data to be used is as below:
{
"httpMethod": "PUT",
"body": {
"email_or_phone": "9960411836",
"thirumaligai": "Sri KKC Periyappangar Swamy Thirumaligai",
"interests": "Rahasya Granthams, Divyaprabandham, Purvacharya Vaibhavam",
"samashrayanam": "Done already",
"acharyan_name": "Sri Koyil Kandhadai Chandamarutham Doddaiyachar (Yoganrsimhan Swamy)"
}
}

The expected result is:
{
"statusCode": 200,
"headers": {
"Content-Type": "application/json",
"Content-Length": "566",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "{\"acharyan_name\": \"Sri Koyil Kandhadai Chandamarutham Doddaiyachar (Yoganrsimhan Swamy)\", \"timestamp\": \"2025-11-12T10:50:32.995576+00:00\", \"authorisation\": \"Yes\", \"full_name\": \"Balaji Srinivasa\", \"country\": \"India\", \"postal_code\": \"560062\", \"city\": \"Bengaluru\", \"email_or_phone\": \"9960411836\", \"samashrayanam\": \"Done already\", \"address_line_1\": \"12133 Prestige Falcon City\", \"interests\": \"Rahasya Granthams, Divyaprabandham, Purvacharya Vaibhavam\", \"address_line_2\": null, \"thirumaligai\": \"Sri KKC Periyappangar Swamy Thirumaligai\", \"state_or_province\": \"Karnataka\"}"
}

Go the subscriptions_tbl - scan and check if the record is updated. It should be updated.

#### PUT - data change to existing record

This test is a success case for modifying previously non-null field with data.

The data to be used is as below:
{
"httpMethod": "PUT",
"body": {
"email_or_phone": "9960411836",
"full_name": "Sanjay Srinivasa"
}
}

The expected result is:
{
"statusCode": 200,
"headers": {
"Content-Type": "application/json",
"Content-Length": "566",
"Access-Control-Allow-Origin": "_",
"Access-Control-Allow-Headers": "_",
"Access-Control-Allow-Methods": "POST,PUT,OPTIONS,GET,DELETE"
},
"body": "{\"acharyan_name\": \"Sri Koyil Kandhadai Chandamarutham Doddaiyachar (Yoganrsimhan Swamy)\", \"timestamp\": \"2025-11-12T11:02:40.304757+00:00\", \"authorisation\": \"Yes\", \"full_name\": \"Sanjay Srinivasa\", \"country\": \"India\", \"postal_code\": \"560062\", \"city\": \"Bengaluru\", \"email_or_phone\": \"9960411836\", \"samashrayanam\": \"Done already\", \"address_line_1\": \"12133 Prestige Falcon City\", \"interests\": \"Rahasya Granthams, Divyaprabandham, Purvacharya Vaibhavam\", \"address_line_2\": null, \"thirumaligai\": \"Sri KKC Periyappangar Swamy Thirumaligai\", \"state_or_province\": \"Karnataka\"}"
}

Go the subscriptions_tbl - scan and check if the record is updated. full_name should be updated.

### DELETE Method Data

#### DELETE - trying to delete non-existing record

This case is a failure case where we try to delete a non-existing record.

The data for this test is:
{
"httpMethod": "DELETE",
"body": {"email_or_phone": "999999999999"}
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

This is for the success case.

The data for this test is:
{
"httpMethod": "DELETE",
"body": {"email_or_phone": "9890911836"}
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

Go to the subscription_tbl. The data should not be existing.

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
