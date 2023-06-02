export function setTitleFromMeta() {
  const { name, slogan } = useAppConfig();

  const route = useRoute();

  const title = computed<string>(() =>
    route.meta.title ? route.meta.title : `${name} - ${slogan}`
  );

  useHead({
    title,
    meta() {
      return [{ name: "description", content: "Nuxt Books App" }];
    },
  });

  return title;
}
