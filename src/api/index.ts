import { getFileHash } from '../shared.ts';

export const file = {
  async upload(params: File) {
    const type = (params.name.split('.').pop() || '').toLowerCase();
    const hash = await getFileHash(params);

    const data = new FormData();
    data.append('file', params);
    const response = await fetch(`https://files.ckpavv.workers.dev/${hash}.${type}`, {
      method: 'POST',
      body: data,
    });
    return response.json();
  },
  async list(params?: any) {
    const response = await fetch(`https://files.ckpavv.workers.dev?${new URLSearchParams(params)}`);
    return response.json();
  },
};
