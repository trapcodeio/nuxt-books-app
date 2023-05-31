<script setup lang="ts">
  const links = [
    { name: "Books", route: { name: "index" } },
    { name: "Add Book", route: { name: "books.add" } },
  ];
</script>
<template>
  <div class="flex h-screen">
    <div id="page-content">
      <div id="header">
        <template v-for="link of links">
          <NuxtLink
            :to="link.route"
            :class="{ active: $route.name === link.route.name }"
            >{{ link.name }}</NuxtLink
          >
        </template>
      </div>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
  #page-content {
    @apply m-auto bg-white max-w-md w-full;
    @apply rounded-lg shadow;
    @apply border border-neutral-300;
  }

  #header {
    @apply bg-neutral-100 rounded-t-lg py-3 border-b-2 flex justify-center space-x-2;
  }

  #header a {
    @apply font-light bg-white px-3 py-1.5 rounded-full;
    @apply border border-neutral-300 text-primary-600 hover:text-primary-900;
  }

  #header a.active,
  #header a:hover {
    @apply bg-primary-600 text-white;
  }
</style>
