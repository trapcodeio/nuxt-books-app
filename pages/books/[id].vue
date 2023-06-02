<script setup lang="ts">
  import BookService, { BookForm } from "~/services/book.service";
  import { useNotification } from "~/store/notification";

  definePageMeta({ name: "book", layout: "main" });

  const $route = useRoute();
  const $router = useRouter();
  const notification = useNotification();
  const bookId = computed(() => $route.params.id as string);
  const isBusy = ref(false);
  const showEditForm = ref(false);

  const { data: book, pending, error } = await BookService.fetchBook(bookId);

  notification.watchApiError(error);

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

  const form = reactive<BookForm>({
    title: book.value?.title || "",
    description: book.value?.description || "",
    available: book.value?.available || false,
  });

  const formErrors = ref<string[]>([]);

  // update book
  async function updateBook() {
    formErrors.value = BookService.validate(form);
    if (formErrors.value.length) return;

    isBusy.value = true;

    try {
      await BookService.update(bookId.value, form);

      // update book
      book.value!.title = form.title;
      book.value!.description = form.description;
      book.value!.available = form.available;

      // hide edit form
      showEditForm.value = false;
      notification.notify(`Book: ${form.title} updated successfully`);
    } catch (e) {
      console.error(e);
      notification.notify(`Failed to update book ${form.title}`, "error");
    } finally {
      isBusy.value = false;
    }
  }

  // delete book
  async function deleteBook() {
    if (!confirm(`Are you sure you want to delete ${book.value?.title}`))
      return;

    try {
      await BookService.delete(bookId.value);
      notification.notify(`Book: ${book.value?.title} deleted successfully`);
      await $router.push({ name: "books" });
    } catch (e) {
      console.error(e);
      notification.notify(
        `Failed to delete book ${book.value?.title}`,
        "error"
      );
    }
  }
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

      <div class="mt-5 text-right">
        <button
          @click="() => (showEditForm = !showEditForm)"
          :class="{
            'action-btn-invert green-on-hover': showEditForm,
            'action-btn': !showEditForm,
          }"
        >
          {{ showEditForm ? "Hide" : "Edit/Delete" }}
        </button>
      </div>
    </div>
    <FormErrors :errors="formErrors" />
    <form v-if="showEditForm" class="form mt-5" @submit.prevent="updateBook">
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

      <div class="flex justify-center mt-5 space-x-3">
        <IsBusy v-if="isBusy"></IsBusy>
        <template v-else>
          <button type="submit" class="action-btn">Update</button>
          <button
            type="button"
            @click.prevent="deleteBook"
            class="action-btn-invert red-on-hover"
          >
            Delete
          </button>
        </template>
      </div>
    </form>
  </section>
</template>
