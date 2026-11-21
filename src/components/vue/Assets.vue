<script setup lang="ts">
import type { AssetFile } from '@/api';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { file as fileAPI } from '@/api';
import { useAssets } from '@/composables/useAssets';
import { formatFileSize } from '@/shared.ts';
import Upload from './Upload.vue';

const { files, complete, loading, failed, load, add, remove } = useAssets();
const uploads = ref(0);
const notice = ref('');
const failedPreviews = ref(new Set<string>());

const cards = computed(() => files.value.map((file) => {
  const dot = file.filename.lastIndexOf('.');
  const suffix = dot > 0 && dot < file.filename.length - 1
    ? file.filename.slice(dot)
    : '';
  return {
    file,
    stem: suffix
      ? file.filename.slice(0, dot)
      : file.filename,
    suffix,
  };
}));

function isImage(file: AssetFile) {
  return file.type.startsWith('image/') || /\.(?:png|jpe?g|gif|svg|webp|avif|bmp|ico|tiff?|heic)$/i.test(file.filename);
}

function url(key: string) {
  return `https://r2.ckvv.net/${key.split('/').map(encodeURIComponent).join('/')}`;
}

async function onUpload(file: File) {
  uploads.value++;
  notice.value = '';
  try {
    add(await fileAPI.upload(file));
    notice.value = `已上传：${file.name}`;
  } catch {
    notice.value = `上传失败：${file.name}`;
  } finally {
    uploads.value--;
  }
}

async function onDelete(file: AssetFile) {
  // eslint-disable-next-line no-alert
  const password = prompt(`删除「${file.filename}」？请输入密码`);
  if (!password) {
    return;
  }
  try {
    await fileAPI.del(file.key, password);
    remove(file.key);
    notice.value = `已删除：${file.filename}`;
  } catch (error) {
    notice.value = `删除失败：${error instanceof Error
      ? error.message
      : file.filename}`;
  }
}

async function onPaste(event: ClipboardEvent) {
  if (event.target instanceof Element && event.target.closest('input, textarea, [contenteditable]')) {
    return;
  }
  const files = Array.from(event.clipboardData?.files ?? []);
  if (!files.length) {
    return;
  }
  event.preventDefault();
  for (const file of files) await onUpload(file);
}

onMounted(() => document.addEventListener('paste', onPaste));
onUnmounted(() => document.removeEventListener('paste', onPaste));
</script>

<template>
  <section class="space-y-5">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold">
        文件库
      </h1>
      <Upload @change="onUpload">
        <button type="button" class="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
          {{ uploads ? '正在上传…' : '上传文件' }}
        </button>
      </Upload>
    </header>
    <p v-if="notice" role="status" class="break-all text-sm">
      {{ notice }}
    </p>
    <ul v-if="files.length" class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
      <li v-for="{ file, stem, suffix } in cards" :key="file.key" class="asset-card relative min-w-0">
        <a :href="url(file.key)" target="_blank" rel="noopener" class="group block rounded-md focus-visible:outline-offset-2" :title="file.filename" :aria-label="file.filename">
          <div class="flex aspect-3/2 items-end overflow-hidden rounded-md border border-slate-200 bg-slate-100 group-hover:border-slate-400">
            <img v-if="isImage(file) && !failedPreviews.has(file.key)" loading="lazy" class="h-full w-full object-contain" :src="url(file.key)" alt="" @error="failedPreviews.add(file.key)">
            <span v-else aria-hidden="true" class="truncate px-3 py-2 font-mono text-2xl font-semibold text-slate-500">{{ suffix.slice(1).toUpperCase() || 'FILE' }}</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between gap-2">
            <span class="flex min-w-0 flex-1 text-sm font-medium text-slate-900">
              <span class="truncate">{{ stem }}</span><span v-if="suffix" class="max-w-[50%] shrink-0 truncate">{{ suffix }}</span>
            </span>
            <span class="shrink-0 text-xs tabular-nums text-slate-500">{{ file.size ? formatFileSize(file.size) : '0 B' }}</span>
          </div>
        </a>
        <button type="button" class="asset-delete absolute top-2 right-2 rounded bg-white px-2 py-1 text-xs text-slate-700 hover:text-red-700" :aria-label="`删除 ${file.filename}`" @click="onDelete(file)">
          删除
        </button>
      </li>
    </ul>
    <div class="py-4 text-center text-sm text-gray-600">
      <button v-if="failed" type="button" class="text-blue-700" @click="load">
        读取文件失败，点击重试
      </button>
      <span v-else-if="loading">正在读取文件…</span>
      <p v-else-if="complete && !files.length">
        文件库为空，可以上传第一个文件。
      </p>
      <button v-else-if="!complete" type="button" class="rounded-md border border-gray-300 px-4 py-2" @click="load">
        显示更多文件
      </button>
    </div>
  </section>
</template>

<style scoped>
@media (hover: hover) and (pointer: fine) {
  .asset-card:not(:hover):not(:focus-within) .asset-delete {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
