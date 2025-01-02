export async function getFileHash(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function formatFileSize(bytes: number, decimals = 1) {
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; // 单位
  const i = Math.floor(Math.log(bytes) / Math.log(k)); // 确定单位

  return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}

export function isPicture(key: string) {
  return ['png', 'jpg', 'jpeg', 'gif', 'tif', 'tiff', 'svg'].includes(`${key.split('.').pop()}`);
}
