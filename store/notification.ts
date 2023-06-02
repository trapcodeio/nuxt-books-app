import { ref, Ref } from "vue";
import { defineStore } from "pinia";

type Notification = {
  message: string;
  type: "success" | "error";
};

export const useNotification = defineStore("notification", () => {
  const data = ref<Notification>();

  // A function to show a notification
  function notify(
    message: string,
    type: Notification["type"] = "success",
    timeout = 5000
  ) {
    data.value = { message, type };
    setTimeout(clear, timeout);
  }

  // Clear the notification
  function clear() {
    data.value = undefined;
  }

  // watch error messages and show them as notifications
  function watchApiError(err: Ref<Error | null>) {
    // Client-side only
    if (!process.client) return;

    watch(
      err,
      (error) => {
        if (error) {
          notify(error.message, "error");
        } else {
          clear();
        }
      },
      { immediate: true }
    );
  }

  return { notify, clear, data, watchApiError };
});
