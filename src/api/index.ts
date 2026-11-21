import { encodeAssetKey, getFileHash } from '@/shared.ts';

export interface AssetFile {
  key: string;
  filename: string;
  size: number;
  type: string;
}

interface AssetPage {
  items: AssetFile[];
  nextCursor: string | null;
}

const endpoint = import.meta.env.PUBLIC_ASSETS_API || 'https://api.ckvv.net/r2';

async function request(path: string, options?: RequestInit) {
  const response = await fetch(`${endpoint}${path}`, {
    ...options,
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) {
    throw new Error(response.status === 403
      ? '密码不正确或未配置删除权限'
      : `请求失败（${response.status}）`);
  }
  const result = await response.json();
  if (result?.success === false) {
    throw new Error('文件服务请求失败');
  }
  return result;
}

export const file = {
  async upload(file: File): Promise<AssetFile> {
    const extension = (file.name.split('.').pop() || '').toLowerCase();
    const hash = await getFileHash(file);
    const body = new FormData();
    body.append('file', file);
    return request(`/${encodeURIComponent(`${hash}.${extension}`)}`, { method: 'POST', body });
  },
  async list(limit: number, cursor?: string): Promise<AssetPage> {
    const params = new URLSearchParams({
      view: 'page',
      limit: String(limit),
    });
    if (cursor) {
      params.set('cursor', cursor);
    }
    const page = await request(`?${params}`);
    if (!Array.isArray(page?.items) || !(page.nextCursor === null || typeof page.nextCursor === 'string')) {
      throw new Error('无效的文件列表');
    }
    return page;
  },
  async del(key: string, password: string) {
    await request(`/${encodeAssetKey(key)}`, {
      headers: { Authorization: password },
      method: 'DELETE',
    });
  },
};
