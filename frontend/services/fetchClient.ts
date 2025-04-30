type FetchClientOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

const BASE_URL = 'http://10.109.130.27:3000';

export async function fetchClient<T = unknown>(
  endpoint: string,
  { body, headers, ...customConfig }: FetchClientOptions = {},
): Promise<T> {
  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMsg = `Error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      }
    } catch {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}
