import { Adapters } from "@leancloud/adapter-types";

export const storage: Adapters["storage"] = {
  getItem(key) {
    return wx.getStorageSync(key);
  },

  setItem(key, value) {
    return wx.setStorageSync(key, value);
  },

  removeItem(key) {
    return wx.removeStorageSync(key);
  },

  clear() {
    return wx.clearStorageSync();
  },
};
