import { Adapters } from "@leancloud/adapter-types";

export * from "./storage";
export * from "./websocket";
export * from "./http";
export * from "./auth";

export const platformInfo: Adapters["platformInfo"] = {
  name: "Baidu",
};
