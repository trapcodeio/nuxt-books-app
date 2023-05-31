<script setup lang="ts">
  defineProps({
    errors: {
      type: Array as PropType<string[]>,
      required: true,
    },
  });
</script>

<template>
  <div class="mt-5 text-red-600 text-sm" v-if="errors.length">
    <ul>
      <li v-for="error of errors" :key="error"><b>-</b> {{ error }}</li>
    </ul>
  </div>
</template>
