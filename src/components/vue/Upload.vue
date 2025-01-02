<script setup lang="ts">
import { useTemplateRef } from 'vue';

const emits = defineEmits(['change']);

const inputRef = useTemplateRef('input');
function onClick() {
  inputRef.value?.click();
}
function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const files = target?.files;
  if (files?.length) {
    emits('change', files[0]);
    target.value = '';
  }
}
</script>

<template>
  <div @click="onClick">
    <input ref="input" type="file" class="hidden" @input="onInput">
    <slot />
  </div>
</template>
