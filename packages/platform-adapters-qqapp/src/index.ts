import { Adapters } from "@leancloud/adapter-types";

export {
  WebSocket,
  storage,
  request,
  upload,
} from "@leancloud/platform-adapters-weapp";

export { getAuthInfo } from "./auth";

export const platformInfo: Adapters["platformInfo"] = {
  name: "QQApp",
};
