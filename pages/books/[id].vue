<script setup lang="ts">
  import BookService from "~/services/book.service";

  definePageMeta({ name: "book", layout: "main" });

  const $route = useRoute();
  const bookId = computed(() => $route.params.id as string);

  const { data: book, pending } = await BookService.fetchBook(bookId);

  useHead({
    title: () => {
      return book.value ? `Book: ${book.value.title}` : "View Book";
    },
    meta: () => {
      const description = book.value
        ? `View details of ${book.value.title}`
        : "View a book page";

      return [{ name: "description", content: description }];
    },
  });
</script>

<template>
  <IsBusy v-if="pending" message="Fetching Book"></IsBusy>
  <section v-else-if="book" class="p-5">
    <h3 class="text-primary-900 text-lg">
      Title: <span class="font-bold text-neutral-700">{{ book.title }}</span>
    </h3>
    <div class="mt-3">
      <h3 class="text-primary-900 text-lg">Description:</h3>
      <p v-html="book.description" class="text-neutral-700"></p>
    </div>
  </section>
</template>
