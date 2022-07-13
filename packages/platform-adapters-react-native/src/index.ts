import { Adapters } from "@leancloud/adapter-types";
export * from "@leancloud/platform-adapters-browser";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = { ...AsyncStorage, async: true };

export const platformInfo: Adapters["platformInfo"] = {
  name: "ReactNative",
};
