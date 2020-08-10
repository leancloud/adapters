import { Adapters } from "@leancloud/adapter-types";
export * from "@leancloud/platform-adapters-browser";

import AsyncStorage from '@react-native-community/async-storage';

export const storage = {...AsyncStorage, async: true };

export const platformInfo: Adapters["platformInfo"] = {
  name: "ReactNative",
};
