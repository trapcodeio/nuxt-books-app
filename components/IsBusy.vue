<script setup lang="ts">
  defineProps({
    message: { type: String },
    addSpace: { type: Boolean, default: true },
  });
</script>
<template>
  <div class="flex flex-col justify-center" :class="{ 'my-10': addSpace }">
    <LoadingSvg width="50" height="50" class="text-primary-700 mx-auto" />
    <template v-if="message">
      <h6
        class="text-neutral-500 text-center text-sm font-medium opacity-80 mt-1"
      >
        {{ message }}
      </h6>
    </template>
  </div>
</template>
