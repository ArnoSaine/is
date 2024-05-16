export const loadUser = () => {
  return JSON.parse(sessionStorage.getItem("user") ?? "null");
};
