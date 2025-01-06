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

export function arrayBufferToBase64(buffer: Iterable<number>) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function stringToKey(str: string) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hash) as BufferSource;
}

// 加密
export async function encrypt(data: string, skey: string) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const key = await stringToKey(skey);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    cryptoKey,
    encodedData,
  );
  return `${arrayBufferToBase64(new Uint8Array(ciphertext))}.${arrayBufferToBase64(iv)}`;
}

// 解密
export async function decrypt(data: string, skey: string) {
  const decoder = new TextDecoder();
  const key = await stringToKey(skey);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );

  const [_ciphertext, _iv] = data.split('.');
  const ciphertext = base64ToArrayBuffer(_ciphertext);
  const iv = base64ToArrayBuffer(_iv);

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    cryptoKey,
    ciphertext,
  );
  return decoder.decode(new Uint8Array(decryptedData));
}
