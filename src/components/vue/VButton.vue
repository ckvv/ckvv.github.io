<script setup lang="ts">
const count = defineModel('count', { default: 0 });
</script>

<template>
  <button class="v-button text-green-500 bg-green-200 px-2 py-1 whitespace-nowrap rounded-lg" @click="count++ ">
    <slot />{{ count }}
  </button>
</template>
