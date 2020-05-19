import { Adapters } from "@leancloud/adapter-types";

export const storage: Adapters["storage"] = {
  getItem(key) {
    return tt.getStorageSync(key);
  },

  setItem(key, value) {
    return tt.setStorageSync(key, value);
  },

  removeItem(key) {
    return tt.removeStorageSync(key);
  },

  clear() {
    return tt.clearStorageSync();
  }
};
