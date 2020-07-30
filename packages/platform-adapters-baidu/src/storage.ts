import { Adapters } from "@leancloud/adapter-types";

export const storage: Adapters["storage"] = {
  getItem(key) {
    return swan.getStorageSync(key) as string;
  },

  setItem(key, value) {
    return swan.setStorageSync(key, value);
  },

  removeItem(key) {
    return swan.removeStorageSync(key);
  },

  clear() {
    return swan.clearStorageSync();
  },
};
