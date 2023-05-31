<script setup lang="ts">
  import { useNotification } from "~/store/notification";

  const links = [
    { name: "Books", route: { name: "books" }, related: ["book"] },
    { name: "Add Book", route: { name: "books.add" } },
  ];
  const notification = useNotification();
</script>
<template>
  <div class="flex h-screen">
    <div id="page-content">
      <div id="header">
        <template v-for="link of links">
          <NuxtLink
            :to="link.route"
            :class="{
              active: $route.name === link.route.name || (link.related && link.related.includes($route.name as string)),
            }"
            >{{ link.name }}</NuxtLink
          >
        </template>
      </div>
      <div>
        <template v-if="notification.data">
          <div class="notification" :class="{ [notification.data.type]: true }">
            <span v-text="notification.data.message" />
            <button
              @click.prevent="() => notification.clear()"
              class="px-2 hover:text-base"
            >
              X
            </button>
          </div>
        </template>
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

  .notification {
    @apply flex justify-between space-x-3 items-center text-sm mb-3 px-2 py-2;
  }

  .notification.success {
    @apply bg-green-300 text-green-900;
  }

  .notification.error {
    @apply bg-red-300  text-red-900;
  }
</style>
