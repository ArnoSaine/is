export interface User {
  name: string;
  roles?: string[];
}

export const loadUser = () => {
  return JSON.parse(sessionStorage.getItem("user") ?? "null") as User | null;
};
