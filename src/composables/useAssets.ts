import type { AssetFile } from '@/api';
import { computed, onMounted, reactive, ref } from 'vue';
import { file as fileAPI } from '@/api';

export function useAssets() {
  const files = reactive(new Map<string, AssetFile>());
  const removed = new Set<string>();
  const loading = ref(false);
  const failed = ref(false);
  const complete = ref(false);
  let cursor: string | undefined;

  async function load() {
    if (loading.value || complete.value) {
      return;
    }
    loading.value = true;
    failed.value = false;
    try {
      const page = await fileAPI.list(20, cursor);
      for (const file of page.items) {
        if (!removed.has(file.key) && !files.has(file.key)) {
          files.set(file.key, file);
        }
      }
      cursor = page.nextCursor ?? undefined;
      complete.value = page.nextCursor === null;
    } catch {
      failed.value = true;
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);
  return {
    files: computed(() => Array.from(files.values())),
    loading,
    failed,
    complete,
    load,
    add(file: AssetFile) {
      removed.delete(file.key);
      files.set(file.key, file);
    },
    remove(key: string) {
      removed.add(key);
      files.delete(key);
    },
  };
}
