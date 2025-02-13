<script setup lang="ts">
import { ref } from 'vue';

const color = ref();
const error = ref();

function handlerCLick() {
  const eyeDropper = new (window as any).EyeDropper();
  eyeDropper
    .open()
    .then((res: any) => {
      color.value = res;
    })
    .catch((e: any) => {
      error.value = e;
    });
}
</script>

<template>
  <div @click="handlerCLick">
    <slot />
  </div>
  {{ color }}
  {{ error }}
</template>
