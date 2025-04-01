import { getFileHash } from '@/shared.ts';

async function request(url: string, options?: RequestInit, timeout = 12000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { ...options, signal: controller.signal })
    .then((response) => {
      clearTimeout(timeoutId);
      return response;
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    });
}

export const file = {
  async upload(params: File) {
    const type = (params.name.split('.').pop() || '').toLowerCase();
    const hash = await getFileHash(params);

    const data = new FormData();
    data.append('file', params);
    const response = await request(`https://api.ckvv.net/r2/${hash}.${type}`, {
      method: 'POST',
      body: data,
    });
    return response.json();
  },
  async list(params?: any) {
    const response = await request(`https://api.ckvv.net/r2?${new URLSearchParams(params)}`);
    return response.json();
  },
  async del(key: any, password: string) {
    const response = await request(`https://api.ckvv.net/r2/${key}`, {
      headers: new Headers({
        Authorization: password,
      }),
      method: 'DELETE',
    });
    return response.json();
  },
};
