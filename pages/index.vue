<script setup lang="ts">
  import BookService from "~/services/book.service";
  import { useNotification } from "~/store/notification";

  definePageMeta({ name: "books", layout: "main" });
  const config = useAppConfig();
  const search = ref("");
  const isSearchResult = ref(false);
  const notification = useNotification();

  useHead({
    title: config.name,
    meta: [{ name: "description", content: config.slogan }],
  });

  const {
    data: books,
    pending: isBusy,
    refresh: fetchBooks,
  } = await BookService.fetchBooks();

  // delete all books
  async function deleteAllBooks() {
    const shouldDelete = confirm("Are you sure you want to delete all books?");
    if (!shouldDelete) return;

    isBusy.value = true;
    try {
      await BookService.deleteAll();
      books.value = [];
    } catch (e) {
      notification.notify(`Unable to delete all books`, "error");
    } finally {
      isBusy.value = false;
    }
  }

  // search
  async function searchBooks() {
    if (!search.value) return stopSearching();

    isBusy.value = true;

    try {
      const { data } = await BookService.findByTitle(search.value);
      books.value = data;
      isSearchResult.value = true;
    } catch (e) {
      notification.notify(`Unable to search books`, "error");
    } finally {
      isBusy.value = false;
    }
  }

  // stop searching
  function stopSearching() {
    search.value = "";
    if (isSearchResult.value) {
      isSearchResult.value = false;
      fetchBooks();
    }
  }
</script>

<template>
  <form @submit.prevent="searchBooks">
    <input
      v-model="search"
      type="search"
      class="search"
      placeholder="Search Books"
      :onsearch="
        () => {
          if (!search) stopSearching();
        }
      "
    />
  </form>
  <div class="text-center text-xs py-2" v-if="search && isSearchResult">
    <p>
      Showing search results for:
      <span class="text-primary-700">{{ search }}</span>
    </p>
  </div>
  <IsBusy v-if="isBusy" message="Fetching Books"></IsBusy>
  <section v-else-if="books && books.length">
    <div class="flex flex-col divide-y">
      <template v-for="(book, key) of books">
        <NuxtLink
          :to="{ name: 'book', params: { id: book.id } }"
          class="flex w-full justify-between py-3 px-2 hover:bg-neutral-100"
        >
          <h2 class="text-primary-900">
            <span class="font-light text-sm text-neutral-500 mr-1"
              >{{ key + 1 }}.</span
            >
            {{ book.title }}
          </h2>
          <div>
            <span
              class="text-xs lowercase rounded-full px-2 py-0.5"
              :class="{
                'bg-primary-600 text-primary-50': book.available,
                'bg-red-600 text-red-50': !book.available,
              }"
              >{{ book.available ? "Available" : "Lent" }}</span
            >
          </div>
        </NuxtLink>
      </template>
    </div>
  </section>
  <div class="flex justify-center my-10" v-else>
    <div>
      <h6 class="text-center mb-3 text-neutral-500">No Books Found</h6>
      <img src="/static/media/no-book.png" width="220" alt="no-book" />
    </div>
  </div>
</template>

<style>
  .search {
    @apply bg-white w-full px-3 py-3 text-sm;
    @apply border-b border-neutral-300 hover:border-b-2 hover:border-primary-900 hover:border-opacity-50  outline-none;
  }
</style>
