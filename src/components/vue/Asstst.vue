<script setup lang="ts">
import { file as fileAPI } from '@/api';
import { formatFileSize, isPicture } from '@/shared.ts';
import { onMounted, onUnmounted, ref } from 'vue';
import Upload from './Upload.vue';

const limit = 20;
const isHaveError = ref(false);
const isHaveMore = ref(false);
const isLoading = ref(true);
const isUploading = ref(false);
const files = ref<{ key: string; size: number }[]>([]);

async function onUpload(file: any) {
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

async function handlerDel(e: Event, file: any, index: number, tip?: string) {
  e.preventDefault();
  try {
    // eslint-disable-next-line no-alert
    const password = prompt(tip || '请输入密码');

    if (!password) {
      return;
    }

    const result = await fileAPI.del(file.key, password);
    if (result?.success === false) {
      return handlerDel(e, file, index, '密码错误, 请重新输入密码');
    }
    files.value.splice(index, 1);
  } catch (error) {

  }
}

async function handlerPaste(event: ClipboardEvent) {
  event.preventDefault();
  // 从粘贴板中获取数据
  const clipboardData = event.clipboardData;
  if (clipboardData && clipboardData.items) {
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      // 检查是否为文件
      if (item.kind !== 'file') {
        continue;
      }
      const file = item.getAsFile();
      await onUpload(file);
    }
  }
}

onMounted(async () => {
  search();
  document.addEventListener('paste', handlerPaste);
});

onUnmounted(() => {
  document.removeEventListener('paste', handlerPaste);
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <Upload class="self-end sticky top-24 z-10" @change="onUpload">
      <button class="cursor-pointer px-4 py-1.5 text-black bg-blue-100 hover:bg-blue-500 hover:text-white rounded">
        {{ isUploading ? "正在上传..." : '上传' }}
      </button>
    </Upload>

    <div class="flex flex-wrap justify-center items-center gap-6">
      <a v-for="(file, index) in files" :key="file.key" :href="`https://r2.ckvv.net/${file.key}`" target="_blank" class="group w-full min-h-24 md:w-52 md:h-52 p-2 hover:shadow-md cursor-pointer flex justify-center items-center !bg-gray-100 rounded relative">
        <img v-if="isPicture(file.key)" class="max-w-full max-h-full" :src="`https://r2.ckvv.net/${file.key}`" :alt="`.${file.key.split('.').pop()}(${formatFileSize(file.size)})`">
        <div v-else class="">
          {{ `.${file.key.split('.').pop()}` }}({{ formatFileSize(file.size) }})
        </div>
        <div class="w-8 h-8 justify-center items-center text-red-500 absolute top-0 right-0 hidden group-hover:flex text-xl hover:text-2xl" @click.stop="(e) => handlerDel(e, file, index)">x</div>
      </a>
      <div v-for="i in 4" :key="i" class="w-52 h-0" />
    </div>
    <div class="select-none text-center cursor-pointer">
      <div v-if="isLoading">
        加载中...
      </div>
      <div v-if="isHaveError" @click="search">
        加载失败, 请点击重试
      </div>
      <div v-if="isHaveMore" @click="search">
        加载更多
      </div>
      <div v-if="!isHaveMore && !isLoading && !isHaveError" class="text-center text-gray-500">
        --- 到底部了 ---
      </div>
    </div>
  </div>
</template>
