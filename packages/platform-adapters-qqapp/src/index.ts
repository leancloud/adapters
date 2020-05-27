import { Adapters } from "@leancloud/adapter-types";

export * from "@leancloud/platform-adapters-weapp";

export { getAuthInfo } from "./auth";

export const platformInfo: Adapters["platformInfo"] = {
  name: "QQApp",
};
