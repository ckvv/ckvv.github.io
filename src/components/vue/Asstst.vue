<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { file as fileAPI } from '../../api';
import { formatFileSize, isPicture } from '../../shared.ts';
import Upload from './Upload.vue';

const limit = 20;
const isHaveError = ref(false);
const isHaveMore = ref(false);
const isLoading = ref(true);
const isUploading = ref(false);
const files = ref<{ key: string; size: number }[]>([]);

async function onChange(file: any) {
  try {
    isUploading.value = true;
    const result = await fileAPI.upload(file);
    files.value.push(result);
  } catch (error) {
  } finally {
    isUploading.value = false;
  }
}

async function search() {
  isLoading.value = true;
  isHaveError.value = false;
  isHaveMore.value = false;
  try {
    const params: any = { limit };
    const startAfter = files.value[files.value.length - 1]?.key;
    if (startAfter) {
      params.startAfter = startAfter;
    }
    const result = await fileAPI.list(params);

    if (Array.isArray(result)) {
      files.value = files.value.concat(result);

      // 不判断 false
      if (result.length >= limit) {
        isHaveMore.value = true;
      }
    }
  } catch (error) {
    isHaveError.value = true;
    isHaveMore.value = false;
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  search();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <Upload class="self-end" @change="onChange">
      <button class="px-4 py-2 text-blue-500 bg-gray-100 rounded hover:text-blue-600">
        {{ isUploading ? "正在上传..." : '上传' }}
      </button>
    </Upload>

    <div class="flex flex-wrap justify-center items-center gap-6">
      <a v-for="file in files" :key="file.key" :href="`https://files.ckpavv.workers.dev/${file.key}`" target="_blank" class="w-52 h-52 p-2 hover:shadow-md cursor-pointer flex justify-center items-center !bg-gray-100 rounded">
        <img v-if="isPicture(file.key)" class="max-w-full max-h-full" :src="`https://files.ckpavv.workers.dev/${file.key}`" :alt="`.${file.key.split('.').pop()}(${formatFileSize(file.size)})`">
        <div v-else class="">
          {{ `.${file.key.split('.').pop()}` }}({{ formatFileSize(file.size) }})
        </div>
      </a>
      <div v-for="i in 4" :key="i" class="w-52 h-0" />
    </div>
    <div class="select-none text-center cursor-pointer">
      <div v-if="isLoading">
        加载中...
      </div>
      <div v-if="isHaveError" @click="search">
        加载失败(需要 VPN 访问), 点击重试
      </div>
      <div v-if="isHaveMore" @click="search">
        加载更多
      </div>
      <div v-if="!isHaveMore && !isLoading && !isHaveError">
        --- 到底部了 ---
      </div>
    </div>
  </div>
</template>
