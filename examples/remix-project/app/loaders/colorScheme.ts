export const loadColorScheme = () => {
  return sessionStorage.getItem("colorScheme") ?? undefined;
};
