import { Adapters } from "@leancloud/adapter-types";

export const storage: Adapters["storage"] = {
  getItem(key) {
    const { data } = my.getStorageSync({ key });
    return data as string;
  },

  setItem(key, value) {
    return my.setStorageSync({ key, data: value });
  },

  removeItem(key) {
    return my.removeStorageSync({ key });
  },

  clear() {
    return my.clearStorageSync();
  },
};
