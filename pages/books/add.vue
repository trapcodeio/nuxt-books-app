<script setup lang="ts">
  import BookService, { BookForm } from "~/services/book.service";
  import { useNotification } from "~/store/notification";

  definePageMeta({ name: "books.add", layout: "main" });

  useHead({
    title: "Add Book",
    meta: [{ name: "description", content: "Add a new book" }],
  });

  const $router = useRouter();
  const notification = useNotification();

  const form = reactive<BookForm>({
    title: "",
    description: "",
    available: true,
  });

  const formErrors = ref<string[]>([]);
  const isBusy = ref(false);

  // add book
  async function addBook() {
    formErrors.value = BookService.validate(form);
    if (formErrors.value.length) return;

    isBusy.value = true;

    try {
      await BookService.create(form);
      notification.notify(`Book: ${form.title} added successfully`);
      await $router.push({ name: "books" });
    } catch (e: any) {
      notification.notify(
        `Failed to add book "${form.title}": ${e.message}`,
        "error"
      );
    } finally {
      isBusy.value = false;
    }
  }
</script>
<template>
  <section class="p-5">
    <h2 class="text-lg font-bold text-primary-900">Add Book</h2>

    <FormErrors :errors="formErrors" />

    <form class="form mt-5" @submit.prevent="addBook">
      <div>
        <label>Title</label>
        <input
          type="text"
          class="input"
          v-model="form.title"
          placeholder="Book Title"
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          cols="5"
          v-model="form.description"
          :placeholder="
            form.title ? `About: ${form.title}` : 'About your book...'
          "
        ></textarea>
      </div>

      <div class="flex item-center space-x-1">
        <label>Available:</label>
        <input
          type="checkbox"
          class="accent-primary-600"
          v-model="form.available"
        />
      </div>

      <div class="text-center mt-5">
        <IsBusy class="my-3" v-if="isBusy" message="Adding Book"></IsBusy>
        <button v-else type="submit" class="action-btn">Add Book</button>
      </div>
    </form>
  </section>
</template>
