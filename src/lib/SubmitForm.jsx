import { CognitoIdentityClient, GetIdCommand, GetCredentialsForIdentityCommand } from '@aws-sdk/client-cognito-identity';
import { createSignedFetcher } from 'aws-sigv4-fetch';

const REGION = 'ap-south-1';
const COGNITO_IDENTITY_POOL_ID = 'ap-south-1:89430077-850f-47bd-8d94-ed59223c2ed4';

const getAnonymousCredentials = async () => {
  const client = new CognitoIdentityClient({ region: REGION });
  const { IdentityId } = await client.send(new GetIdCommand({ IdentityPoolId: COGNITO_IDENTITY_POOL_ID }));
  const { Credentials } = await client.send(new GetCredentialsForIdentityCommand({ IdentityId }));
  return {
    credentials: {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretKey,
      sessionToken: Credentials.SessionToken,
    },
    region: REGION,
    service: 'execute-api',
  };
};

export async function SubmitForm(formData, endpoint) {
  const fetcherParams = await getAnonymousCredentials();
  const fetchAws = createSignedFetcher(fetcherParams);

  const response = await fetchAws(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return response;
}



