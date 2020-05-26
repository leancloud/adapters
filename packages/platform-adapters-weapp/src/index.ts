import "miniprogram-api-typings";
import { Adapters } from "@leancloud/adapter-types";

export * from "./auth";
export * from "./storage";
export * from "./http";
export * from "./websocket";

export const platformInfo: Adapters["platformInfo"] = {
  name: "Weapp",
};
