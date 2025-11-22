import { createSignedFetcher } from 'aws-sigv4-fetch';


export async function PostFormData(relativeUrl, formData, getValidCredentials) {
  let currentCredentials = await getValidCredentials();
  let postUrl = currentCredentials.baseUrl + relativeUrl;
  // Prepare signed fetcher
  const fetcherParams = {
    credentials: {
      accessKeyId: currentCredentials.accessKeyId,
      secretAccessKey: currentCredentials.secretAccessKey,
      sessionToken: currentCredentials.sessionToken,
    },
    region: currentCredentials.region, // or come from config/state
    service: 'execute-api',
  };

  const fetchAws = createSignedFetcher(fetcherParams);

  let response = await fetchAws(postUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  // If token missing / 403 Forbidden, refresh credentials and retry once
  if (response.status === 403) {
    const body = await response.json();
    if (body.message === 'Missing Authentication Token') {
      currentCredentials = await getValidCredentials();
      postUrl = currentCredentials.baseUrl + relativeUrl;
      const refreshedFetcherParams = {
        credentials: {
          accessKeyId: currentCredentials.accessKeyId,
          secretAccessKey: currentCredentials.secretAccessKey,
          sessionToken: currentCredentials.sessionToken,
        },
        region: currentCredentials.region,
        service: 'execute-api',
      };
      const refreshedFetchAws = createSignedFetcher(refreshedFetcherParams);
      response = await refreshedFetchAws(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
  }
  return response;
}
